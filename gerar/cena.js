// Cena em pixels com estações, barcos e capas. Roda no navegador (prévia) e no Node (GIF e GitHub Action).
const GW=256,GH=116,CH=4,SOLO=77,CAB=141;
const BASE={
noite:{m0:'#39465c',m1:'#5e81ac',m2:'#88c0d0',m3:'#eceff4',a0:'#a3d39c',a1:'#63c7b2',a2:'#5a8fc4',a3:'#b48ead',st:'#d8dee9',lua:'#eceff4',lua2:'#aebccf',pa:'#a5484f',pb:'#7d343d',ja:'#ffd479',ma:'#4b3038',fu:'#8390a6',ink:'#e5e9f0',soft:'#8f9bb0',h0:'#8a5a44',h1:'#5d3b33',vl:'#e5edf4',mt:'#c9b39a',cr:'#eceff4'},
dia:{m0:'#b4c5d6',m1:'#86a3c0',m2:'#5e81ac',m3:'#37475f',a0:'#c6d4e1',a1:'#d6e0ea',a2:'#e2e9f0',a3:'#e9eef4',st:'#b9c6d6',lua:'#e8a27c',lua2:'#f0c08f',pa:'#b8525a',pb:'#93404a',ja:'#ffe2a3',ma:'#5a3a42',fu:'#aab8c8',ink:'#2e3440',soft:'#5f6b7f',h0:'#9a6448',h1:'#6b4438',vl:'#d5dfe8',mt:'#7d6250',cr:'#37475f'}};
// arv: variantes [contorno, sombra, luz, ponta]; alt: tons da encosta abaixo da linha de neve; nl: linha de neve; aur: força da aurora
const EST={
inverno:{nl:200,aur:1,part:'neve',noite:{arv:[['#131f27','#26424b','#3f6b70','#d8e6ee']],so:'#c9d6e2',so2:'#7f9ab5',te:'#e5edf4',te2:'#b9c9d8',p:'#dfe8f1'},dia:{arv:[['#1f3b41','#2f5357','#4d7d7a','#d5e3ec']],so:'#d3dfe9',so2:'#a9bfd2',te:'#e9f0f5',te2:'#c3d1dd',p:'#b6c6d8'}},
primavera:{nl:50,aur:.5,part:'petala',noite:{alt:['#2b4044','#3f6b62','#6fa58c','#b9dcc0'],arv:[['#12241f','#2a5148','#4f8a6f','#8fc79a'],['#12241f','#2a5148','#4f8a6f','#8fc79a'],['#2a1d2a','#7d4f6b','#c98aa6','#f0c3d2']],so:'#6f9f7c',so2:'#466b5a',te:'#5f9070',te2:'#47705a',p:'#f0b9cc'},dia:{alt:['#cfe3cf','#a5cba8','#6fa287','#3d6b62'],arv:[['#1f4038','#3a6d5a','#62a07c','#a9d3a5'],['#1f4038','#3a6d5a','#62a07c','#a9d3a5'],['#8a5570','#c07f9c','#e6a9bd','#f6d3de']],so:'#a6cf9f',so2:'#78a884',te:'#86b98a',te2:'#639a70',p:'#e08fab'}},
verao:{nl:32,aur:0,part:'vaga',noite:{alt:['#2c4440','#44705a','#7aa56f','#cfd692'],arv:[['#14251c','#285040','#4b8259','#86b36a'],['#14251c','#234a3f','#3f7355','#77a565']],so:'#7f9f5c',so2:'#4f6d4a',te:'#6d9450',te2:'#507045',p:'#ffe08a'},dia:{alt:['#d3e6c2','#a3cb91','#679d70','#356650'],arv:[['#1d4030','#2f6a4a','#57995f','#93c47c'],['#1d4030','#2a6048','#4b8a5a','#86b872']],so:'#a9cf86',so2:'#78a866',te:'#83b568',te2:'#5f9153',p:'#e8c25e'}},
outono:{nl:46,aur:.8,part:'folha',noite:{alt:['#453a42','#80594a','#c08a55','#ecc98a'],arv:[['#2a1712','#8a4a2c','#c9783a','#f0b45c'],['#2a1c10','#94692a','#d3a13f','#f5d77e'],['#131f1f','#274642','#426c5f','#7d9f7c'],['#28121a','#78303a','#b2504a','#e08a6a']],so:'#b08a58',so2:'#6f5744',te:'#9c7a48',te2:'#735a3c',p:'#e59a4c'},dia:{alt:['#f0dcbd','#dfb57f','#b57d4e','#6d4a42'],arv:[['#6b3520','#a8592f','#d98a45','#f2bf72'],['#70511c','#b48431','#dfb04c','#f6da8d'],['#243f3a','#3c665a','#628a76','#9cb894'],['#5e2430','#943d42','#c5615a','#e89a80']],so:'#d9b883',so2:'#b08c60',te:'#c29a60',te2:'#957548',p:'#cf7d3a'}}};
// Estações do Brasil (hemisfério sul): outono 20/3, inverno 21/6, primavera 22/9, verão 21/12
const ORDEM=['verao','outono','inverno','primavera'];
function estacaoBR(d=new Date()){const n=(d.getMonth()+1)*100+d.getDate();return n>=1221||n<320?'verao':n<621?'outono':n<922?'inverno':'primavera'}
const cicloBR=d=>{const i=ORDEM.indexOf(estacaoBR(d));return ORDEM.map((_,k)=>ORDEM[(i+k)%4])};
const B4=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],by=(x,y)=>(B4[y&3][x&3]+.5)/16;
function mul(s){return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const novo=()=>new Array(GW*GH).fill(null);
const BARCO=['......m......','.....cmv.....','....ccmv.....','....ccmvv....','...cccmvv....','..ccccmvvv...','..ccccmvvv...','.cccccmvvvv..','......m......','hhhhhhhhhhhhh','.hhhhhhhhhhh.','..kkkkkkkkk..'];
const F35={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'111111101101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111',0:'111101101101111',1:'010110010010111',2:'110001010100111',3:'110001010001110',4:'101101111001001',5:'111100110001110',6:'011100111101111',7:'111001010010010',8:'111101111101111',9:'111101111001110','-':'000000111000000','.':'000000000000010',_:'000000000000111'};
const limpa=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/ /g,'-');

function camadas(modo,est,semanas,TOM,barcos=[]){
  const E=EST[est],C=E[modo],noite=modo==='noite',solMN=noite&&est==='verao',P=Object.assign({},BASE[modo],{so:C.so,so2:C.so2,te:C.te,te2:C.te2,p:C.p});
  (C.alt||[]).forEach((c,i)=>P['g'+i]=c);C.arv.forEach((v,k)=>v.forEach((c,i)=>P['t'+k+i]=c));
  if(solMN)Object.assign(P,{lua:'#f2b880',lua2:'#e08f6a',a0:'#f0c27f',a1:'#e39a6f',a2:'#c0788a',a3:'#7f6a9c'});
  const R=mul(9),g=novo(),set=(x,y,c)=>{if(x>=0&&y>=0&&x<GW&&y<GH)g[y*GW+x]=c},borda=x=>Math.min(1,Math.min(x,GW-1-x)/26),T=TOM[modo],OY=4,mont=new Uint8Array(GW*GH),topo=new Array(GW).fill(GH);
  for(let y=0;y<TOM.h;y++)for(let x=0;x<GW;x++){
    const ch=T[y][x],yy=y+OY;if(ch==='!'||yy>=SOLO)continue;
    mont[yy*GW+x]=1;if(yy<topo[x])topo[x]=yy;
    const b=borda(x),t=parseInt(ch,36)/35,nev=Math.min(1,Math.max(0,(SOLO+1-yy)/24)),th=by(x,yy),verde=yy>E.nl+5*Math.sin(x*.13)+3*Math.sin(x*.37)+8*(th-.5);
    let v=noite?Math.pow(t*1.12,1.2):t*1.05;v*=Math.pow(nev,verde?.25:.6);let k=-1;
    if(v>.55+.42*th)k=3;else if(v>.27+.38*th)k=2;else if(v>.09+.30*th)k=1;else if(b>.15+.85*th&&(noite?nev*.9:(verde?1.1:nev*.42))>th*.95)k=0;
    if(k>=0&&b>=th*.95)set(x,yy,(verde&&C.alt?'g':'m')+k);
  }
  for(let x=0;x<GW;x++)if(topo[x]<SOLO-8&&borda(x)>by(x,0)*.8)set(x,topo[x],C.alt&&topo[x]>E.nl+6?(noite?'g3':'g3'):'cr');
  const ax=solMN?176:206,ay=solMN?55:noite?17:est==='inverno'?24:17,ar=solMN?9:noite?6:8;
  for(let y=-ar;y<=ar;y++)for(let x=-ar;x<=ar;x++)if(x*x+y*y<=ar*ar+1&&!mont[(ay+y)*GW+ax+x]){
    const s=(x*.8+y*.6)/ar;set(ax+x,ay+y,noite&&!solMN?(s>.05+.6*by(x+64,y+64)?'lua2':'lua'):((y+ar)%4===3&&y>0?null:(y>-1?'lua2':'lua')));
  }
  const es=[[],[],[]];
  if(noite&&!solMN)for(let i=0;i<120;i++){const x=R()*GW|0,y=R()*54|0;if(!mont[y*GW+x]&&!g[y*GW+x]&&borda(x)>R())es[i%3].push([x,y])}
  for(let x=0;x<GW;x++){const b=borda(x),k=1+Math.round(1.2*Math.sin(x*.09)+.8*Math.sin(x*.31));for(let y=SOLO-k;y<SOLO+3;y++)if(b>by(x,y)*.9)set(x,y,y>SOLO+1?'so2':(by(x,y)>.8?'so2':'so'))}
  const mx=Math.max(22,...semanas),arv=semanas.map((v,w)=>({x:Math.round(9+w*(GW-18)/(semanas.length-1)),b:SOLO+(R()*3|0)-1,h:v===0?0:Math.round(4+22*Math.pow(v/mx,.5)),k:R()*C.arv.length|0})).sort((a,b)=>a.b-b.b);
  for(const a of arv){
    const K='t'+a.k;if(!a.h){if(a.k%2)set(a.x,a.b,K+'2');continue}
    if(Math.abs(a.x-CAB)<11)a.b=SOLO-2;
    set(a.x,a.b,'ma');const n=a.h,tw=Math.max(1,Math.round(n*.19)),ponta=est==='inverno';
    for(let i=0;i<n;i++){
      const y=a.b-n+i,f=i/n,ph=i%4,w=Math.min(tw+1,Math.max(0,Math.round(f*tw+(ph-1.4)*.45)));
      if(i>0&&y<a.b-1){set(a.x-w-1,y,K+'0');set(a.x+w+1,y,K+'0')}
      for(let k=-w;k<=w;k++){let c=k<=0&&(k+i)%3!==0?K+'2':K+'1';if(k===0&&i<2)c=K+'3';if(i>2&&k<0&&k===-w&&ph===3&&f<.9)c=K+'3';if(ponta&&ph===0&&k<=0&&k>-w&&f<.6&&i>3)c=K+'3';set(a.x+k,y,c)}
    }
  }
  const cx=CAB,cy=SOLO+1;
  for(let y=0;y<6;y++)for(let x=-6;x<=6;x++)set(cx+x,cy-y,(x+6)%3===2?'pb':'pa');
  for(let i=0;i<6;i++)for(let x=-8+i;x<=8-i;x++)set(cx+x,cy-6-i,(i===0||(x+i)%4)?'te':'te2');
  for(let y=0;y<4;y++)for(let x=1;x<=2;x++)set(cx+x,cy-y,'ma');
  for(let y=-13;y<=-9;y++){set(cx+4,cy+y,'pb');set(cx+5,cy+y,'pb')}set(cx+4,cy-14,'te');set(cx+5,cy-14,'te');
  for(const jx of[-4,4])for(let y=2;y<4;y++)for(let x=0;x<2;x++)set(cx+jx+x,cy-y,'ja');
  // céu: aurora, sol da meia-noite ou nuvens
  const NF=noite&&!solMN?6:1,fr=[];
  for(let f=0;f<NF;f++){
    const q=novo(),ph=f/NF*2*Math.PI,livre=(x,y)=>y>=0&&y<SOLO&&!mont[y*GW+x]&&!g[y*GW+x];
    for(let x=0;x<GW;x++){
      const u=x/GW,b=borda(x);
      if(solMN){for(let y=12;y<SOLO;y++){const d=(SOLO-y)/65,px=Math.abs(x-ax)/150,v=b*(1.05-d*1.02-px*.55);if(livre(x,y)&&v>by(x,y))q[y*GW+x]=d<.34?'a0':d<.52?'a1':d<.72?'a2':'a3'}}
      else if(noite)for(const[yb,am,ln,s,k]of[[25,6,21,1.6,2.2],[46,8,36,1,0]]){
        const base=yb+am*Math.sin(u*5.6*s+k+.35*Math.sin(ph))+am*.4*Math.sin(u*14+k*2+.7*Math.cos(ph)),ray=.60+.25*Math.sin(u*47+k*3+ph)+.2*Math.sin(u*83-ph+k),it=E.aur*b*(.38+.62*Math.pow(.5+.5*Math.sin(u*(4.4+k*.6)+k*2.3+.9),1.2)),l=ln*(.72+.4*ray);
        for(let y=Math.floor(base-l);y<=base+1;y++){if(!livre(x,y))continue;const d=(base-y)/l,v=it*ray*1.15*(d<.05?.75:Math.pow(1-d,1.15));if(v>by(x,y)*.92+.02)q[y*GW+x]=d<.22?'a0':d<.46?'a1':d<.70?'a2':'a3'}
      }else for(const[px,py,w,h]of[[52,17,30,5],[96,9,22,3],[232,36,17,4],[168,30,20,3]])for(let y=py-h;y<=py;y++){const d=((x-px)/w)**2+((y-py)/h)**2,v=(1-d+.18*Math.sin(x*.5+py)+.12*Math.sin(x*1.1))*1.2;if(v>0&&livre(x,y)&&v>by(x,y)*.8)q[y*GW+x]=v>.75?'a0':'a1'}
    }
    fr.push(q);
  }
  const L0=SOLO+3,LF=34,lag=[0,1].map(f=>{
    const q=novo();
    for(let y=L0;y<GH;y++){
      const k=y-L0,sy=Math.round(SOLO-1-k*1.75),fd=1-k/LF;if(fd<=0)break;
      for(let x=0;x<GW;x++){
        const sx=x+Math.round(1.4*Math.sin(y*1.7+x*.06+f*Math.PI)),b=borda(x);if(sx<0||sx>=GW||sy<0)continue;
        let c=g[sy*GW+sx]||fr[0][sy*GW+sx];const th=by(x+f*2,y);
        if(c){if(fd*b*.95<th)c=null;else if(c==='m3'||c==='cr')c='m2';else if(c==='m2')c='m1';else if(c==='g3')c='g2';else if(c==='g2')c='g1';else if(c==='te'||c==='so')c='so2';else if(/^t\d[03]$/.test(c))c=c.slice(0,2)+'1'}
        else if((y+f)%4===0&&Math.sin(x*.11+y*2.3+f)>.72&&b>th)c='m0';
        if(c&&(y+f)%3===2&&Math.sin(x*.19+y)>.1)c=null;
        if(c)q[y*GW+x]=c;
      }
    }
    for(let y=L0;y<L0+9;y++)for(let x=-5;x<=6;x++)if((x<-1||x>2)&&by(x+64,y+f)>.35+.05*(y-L0))q[y*GW+cx+x+((y+f)&1)]='ja';
    return q;
  });
  // barcos: um por projeto, vela na cor da linguagem, nome embaixo
  const nb=Math.min(6,barcos.length),bar=[];
  for(let i=0;i<nb;i++){
    const nome=limpa(barcos[i].nome).slice(0,14),lt=nome.length*4-1,x=Math.round(nb===1?128:34+i*(188/(nb-1))),y=i%2?101:95,xt=Math.max(1,Math.min(GW-lt-1,x-(lt>>1)));
    P['v'+i]=barcos[i].cor;const cel=[],ref=[],txt=[];
    BARCO.forEach((l,r)=>[...l].forEach((c,k)=>{if(c!=='.')cel.push([x-6+k,y-11+r,{m:'mt',c:'v'+i,v:'vl',h:'h0',k:'h1'}[c]])}));
    for(let r=0;r<2;r++)for(let k=-4+r;k<=4-r;k++)if((k+r)&1)ref.push([x+k,y+1+r,'h1']);
    [...nome].forEach((c,k)=>{const m=F35[c];if(m)[...m].forEach((v,j)=>{if(v==='1')txt.push([xt+k*4+j%3,y+5+(j/3|0),'ink'])})});
    for(const q of lag){for(let yy=y+3;yy<=y+10;yy++)for(let xx=xt-2;xx<=xt+lt+1;xx++)if(xx>=0&&xx<GW&&yy<GH)q[yy*GW+xx]=null;for(let yy=y-1;yy<=y+2;yy++)for(let xx=x-8;xx<=x+8;xx++)if(xx>=0&&xx<GW)q[yy*GW+xx]=null}
    bar.push({cel,ref,txt});
  }
  // partículas
  const part=[],tipo=E.part,qt={neve:80,petala:noite?26:30,folha:34,vaga:noite?30:12}[tipo];
  for(let i=0;i<qt;i++){const x=R()*GW|0,y=tipo==='vaga'?SOLO-22+(R()*30|0):R()*GH|0;if(borda(x)<R()*.9)continue;part.push({x,y,v:tipo==='neve'?1+(i&1):1,f:R()*6.28,i})}
  const fum=[0,1,2].map(f=>{const c=[];for(let i=0;i<9;i++){const y=cy-16-i,x=cx+4+Math.round(i*.35+1.1*Math.sin(i*.9+f*2.1));if(i%3!==f)c.push([x,y,'fu']);if(i>2&&(i+f)%2)c.push([x+1,y,'fu'])}return c});
  return{P,g,es,fr,lag,bar,part,tipo,fum,NF};
}
// achata tudo num quadro (GIF e capas). N = quadros do ciclo
function quadro(L,i,N,op={}){
  const q=novo(),put=(x,y,c)=>{if(x>=0&&y>=0&&x<GW&&y<GH)q[y*GW+x]=c},por=a=>{for(let k=0;k<q.length;k++)if(a[k])q[k]=a[k]};
  L.es.forEach((s,k)=>{if((i+k)%3)s.forEach(([x,y])=>put(x,y,'st'))});por(L.fr[Math.floor(i/2)%L.NF]);por(L.g);por(L.lag[(i>>2)&1]);
  L.fum[(i>>1)%3].forEach(c=>put(...c));
  L.bar.forEach((b,k)=>{const d=((i>>2)+k)&1;b.ref.forEach(c=>put(...c));b.cel.forEach(([x,y,c])=>put(x,y+d-1,c));if(op.nomes!==false)b.txt.forEach(c=>put(...c))});
  for(const p of L.part){
    if(L.tipo==='vaga'){if(((i+p.i*3)%12)<5)put(p.x+((i+p.i)%24>12?1:0),p.y,'p')}
    else{const y=Math.floor(p.y+GH*p.v*i/N*(L.tipo==='neve'?1:1))%GH,x=p.x+(L.tipo==='neve'?0:Math.round(3*Math.sin(p.f+i/N*6.283*2)));put(x,y,'p');if(L.tipo==='folha'&&p.i%2)put(x+1,y,'p')}
  }
  return q;
}
function caminhos(g,x0=0,y0=0,w=GW,h=GH){
  const o={};for(let y=0;y<h;y++)for(let x=0;x<w;){const c=g[(y+y0)*GW+x+x0];if(!c){x++;continue}let e=x;while(e<w&&g[(y+y0)*GW+e+x0]===c)e++;(o[c]=o[c]||[]).push('M'+x*CH+' '+y*CH+'h'+(e-x)*CH+'v'+CH+'h-'+(e-x)*CH+'z');x=e}return o;
}
const pinta=(g,P,...w)=>Object.entries(caminhos(g,...w)).map(([c,d])=>'<path fill="'+(P[c]||c)+'" d="'+d.join('')+'"/>').join('');
function cels(l,P){const o={};for(const[x,y,c]of l)(o[c]=o[c]||[]).push('M'+x*CH+' '+y*CH+'h4v4h-4z');return Object.entries(o).map(([c,d])=>'<path fill="'+P[c]+'" d="'+d.join('')+'"/>').join('')}
function cena(modo,est,semanas,TOM,o={}){
  const L=camadas(modo,est,semanas,TOM,o.barcos||[]),P=L.P,W=GW*CH,H=GH*CH,sel=(c,i,n,d)=>'<g class="'+c+(i?'':' ini')+'" style="animation-delay:'+(-d+d/n*i).toFixed(2)+'s">';
  let pt='';
  if(L.tipo==='vaga')pt=[0,1,2].map(k=>'<g class="cint" style="animation-delay:-'+k*1.1+'s">'+cels(L.part.filter(p=>p.i%3===k).map(p=>[p.x,p.y,'p']),P)+'</g>').join('');
  else pt=[0,1].map(k=>'<svg x="0" y="0" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><g class="nev'+k+'">'+cels(L.part.filter(p=>(p.i&1)===k).flatMap(p=>{const a=[[p.x,p.y,'p'],[p.x,p.y+GH,'p']];return L.tipo==='folha'?a.concat(a.map(([x,y,c])=>[x+1,y,c])):a}),P)+'</g></svg>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+(o.alto||H)+'" role="img" aria-label="Lago nórdico em pixels" shape-rendering="crispEdges">'+(o.estilo?'<style>'+ESTILO+'</style>':'')
   +L.es.map((s,i)=>'<g class="cint" style="animation-delay:-'+i*1.1+'s">'+cels(s.map(([x,y])=>[x,y,'st']),P)+'</g>').join('')
   +L.fr.map((q,i)=>(L.NF>1?sel('q6',i,6,3.6):'<g>')+pinta(q,P)+'</g>').join('')+pinta(L.g,P)
   +L.lag.map((q,i)=>sel('q2',i,2,1.6)+pinta(q,P)+'</g>').join('')+L.fum.map((q,i)=>sel('q3',i,3,1.8)+cels(q,P)+'</g>').join('')
   +L.bar.map((b,i)=>cels(b.ref,P)+'<g class="bob" style="animation-delay:-'+(i*.7).toFixed(1)+'s">'+cels(b.cel,P)+'</g>'+cels(b.txt,P)).join('')+pt+(o.texto||'')+'</svg>';
}
function quebra(t,n){const o=[''];for(const w of t.split(' ')){if((o[o.length-1]+' '+w).trim().length>n)o.push(w);else o[o.length-1]=(o[o.length-1]+' '+w).trim()}return o}
// Capa de repositório: recorte da cena à direita, nome à esquerda
function capaRepo(modo,est,semanas,TOM,r){
  const L=camadas(modo,est,semanas,TOM,[]),P=L.P,w=132,h=62,x0=r.x,y0=r.y,bx=x0+Math.round(w*(r.b||.62)),byy=y0+h-6;
  P.v0=r.cor;for(const q of L.lag)for(let y=byy-1;y<byy+3;y++)for(let x=bx-8;x<=bx+8;x++)q[y*GW+x]=null;
  const cel=[];BARCO.forEach((l,k)=>[...l].forEach((c,i)=>{if(c!=='.')cel.push([bx-6+i,byy-11+k,{m:'mt',c:'v0',v:'vl',h:'h0',k:'h1'}[c]])}));L.bar=[{cel,ref:[-3,-1,1,3].map(k=>[bx+k,byy+1,'h1']),txt:[]}];
  const fs=[0,4,8].map(i=>{const q=quadro(L,i,24);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=Math.min(1,x/20,(w-1-x)/10,(y+1)/8,(h-y)/7);if(e<by(x,y)*1.02)q[(y+y0)*GW+x+x0]=null}return q});
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 300" role="img" aria-label="Capa de '+r.nome+'"><g shape-rendering="crispEdges" transform="translate(410 8) scale(1.15)">'+fs.map((q,i)=>'<g class="q3'+(i?'':' ini')+'" style="animation-delay:'+(-1.8+.6*i).toFixed(1)+'s">'+pinta(q,P,x0,y0,w,h)+'</g>').join('')+'</g><g><rect x="0" y="92" width="32" height="8" fill="'+r.cor+'"/><text x="0" y="158" font-family="Pixelify Sans,JetBrains Mono,monospace" font-weight="600" font-size="'+Math.min(54,700/r.nome.length).toFixed(0)+'" fill="'+P.ink+'">'+r.nome+'</text>'+quebra(r.desc,32).map((l,i)=>'<text x="0" y="'+(198+i*26)+'" font-family="JetBrains Mono,Consolas,monospace" font-size="19" fill="'+P.soft+'">'+l+'</text>').join('')+'</g></svg>';
}
const ESTILO='.q6,.q3,.q2{opacity:0}.ini{opacity:1}.q6{animation:q6 3.6s steps(1) infinite}@keyframes q6{0%{opacity:1}16.667%{opacity:0}}.q3{animation:q3 1.8s steps(1) infinite}@keyframes q3{0%{opacity:1}33.333%{opacity:0}}.q2{animation:q2 1.6s steps(1) infinite}@keyframes q2{0%{opacity:1}50%{opacity:0}}.bob{animation:bob 2.4s steps(1) infinite}@keyframes bob{0%{transform:translateY(0)}50%{transform:translateY(-4px)}}.cint{animation:ct 3.3s steps(2) infinite alternate}@keyframes ct{from{opacity:1}to{opacity:.25}}.nev0{animation:nv 12s steps('+GH+') infinite}.nev1{animation:nv 19s steps('+GH+') infinite}@keyframes nv{from{transform:translateY(-'+GH*CH+'px)}to{transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.q6,.q3,.q2,.cint,.nev0,.nev1,.bob{animation:none}}';
const ICO={codigo:['....#...o.#...','...##..oo.##..','..##...o...##.','.##...oo....##','..##..o....##.','...##oo...##..','....#o....#...'],janela:['##############','#.o.o........#','##############','#............#','#..oooo.###..#','#..oooo......#','#..oooo.####.#','##############'],dados:['...########...','..#........#..','..##......##..','..#.######.#..','..#........#..','..##..oo..##..','..#.######.#..','..##......##..','...########...'],terminal:['##############','#............#','#.oo.........#','#..oo........#','#.oo..####...#','#............#','##############']};
function icone(k){const a=ICO[k];let o='';a.forEach((l,y)=>[...l].forEach((c,x)=>{if(c!=='.')o+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+(c==='o'?'var(--fr)':'var(--ink)')+'"/>'}));return '<svg viewBox="0 0 '+a[0].length+' '+a.length+'" width="'+a[0].length*2+'" height="'+a.length*2+'" shape-rendering="crispEdges" aria-hidden="true">'+o+'</svg>'}
function barquinho(cor,modo){const P=Object.assign({},BASE[modo],{v0:cor});let o='';BARCO.forEach((l,y)=>[...l].forEach((c,x)=>{if(c!=='.')o+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+P[{m:'mt',c:'v0',v:'vl',h:'h0',k:'h1'}[c]]+'"/>'}));return '<svg viewBox="0 0 13 12" width="26" height="24" shape-rendering="crispEdges" aria-hidden="true">'+o+'</svg>'}
if(typeof module!=='undefined')module.exports={estacaoBR,cicloBR,camadas,quadro,cena,capaRepo,by,GW,GH};
