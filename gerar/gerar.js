// Gera os quadros da capa: node gerar.js <pasta>. Usa o calendário do GitHub quando GH_TOKEN existe.
const fs = require('fs'), K = require('./cena.js'), TOM = require('./tom.json'), barcos = require('./projetos.json'), base = require('./semanas.json');
const out = process.argv[2], LOGIN = process.env.LOGIN || 'andreAndrusaitis', N = 14, DIS = 4;

async function semanas() {
  // semanas (a partir do domingo) -> commits; a base guarda os totais anteriores, sem nomes de repositórios
  const s = { ...base };
  if (process.env.GH_TOKEN) {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST', headers: { authorization: 'bearer ' + process.env.GH_TOKEN, 'user-agent': 'capa' },
      body: JSON.stringify({ query: 'query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{weeks{firstDay contributionDays{contributionCount}}}}}}', variables: { l: LOGIN } }),
    });
    const j = await r.json();
    if (!j.data?.user) throw new Error('GitHub: ' + JSON.stringify(j.errors || j).slice(0, 200));
    for (const w of j.data.user.contributionsCollection.contributionCalendar.weeks) {
      const n = w.contributionDays.reduce((a, d) => a + d.contributionCount, 0);
      s[w.firstDay] = Math.max(s[w.firstDay] || 0, n);
    }
  }
  const hoje = new Date(); hoje.setUTCHours(12, 0, 0, 0); hoje.setUTCDate(hoje.getUTCDate() - hoje.getUTCDay() - 52 * 7);
  return Array.from({ length: 53 }, (_, i) => { const d = new Date(hoje); d.setUTCDate(d.getUTCDate() + i * 7); return s[d.toISOString().slice(0, 10)] || 0; });
}

(async () => {
  const sem = await semanas(), ests = K.cicloBR(new Date(Date.now() - 3 * 36e5));
  fs.mkdirSync(out, { recursive: true });
  for (const modo of ['noite', 'dia']) {
    const Ls = ests.map(e => K.camadas(modo, e, sem, TOM, barcos)), cores = {}, pal = [[0, 0, 0]], buf = [];
    const idx = h => cores[h] ?? (pal.push([1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))), cores[h] = pal.length - 1);
    ests.forEach((_, s) => {
      const A = Ls[s], B = Ls[(s + 1) % 4];
      for (let i = 0; i < N; i++) {
        const k = s * N + i, a = K.quadro(A, k, 56), b = i >= N - DIS ? K.quadro(B, k, 56) : null, p = b ? (i - (N - DIS) + 1) / (DIS + 1) : 0, f = Buffer.alloc(K.GW * K.GH);
        for (let j = 0; j < f.length; j++) { const T = b && K.by(j % K.GW, j / K.GW | 0) < p, c = T ? b[j] : a[j]; f[j] = c ? idx((T ? B : A).P[c]) : 0; }
        buf.push(f);
      }
    });
    if (pal.length > 256) throw new Error('cores demais: ' + pal.length);
    fs.writeFileSync(`${out}/${modo}.raw`, Buffer.concat(buf));
    fs.writeFileSync(`${out}/${modo}.json`, JSON.stringify({ w: K.GW, h: K.GH, n: buf.length, pal }));
  }
  console.log('estações:', ests.join(' > '), '| semanas com commits:', sem.filter(Boolean).length);
})();
