// ================= Exercise demo animations — engine v2 =================
// Angles are absolute degrees measured from straight DOWN; positive rotates toward +x.
// Side view: athlete faces +x.  Front view: N = athlete's side drawn at +x, F at -x.
// Torso angle t is measured from straight UP (positive = lean toward +x).
(function(global){
"use strict";
const NS="http://www.w3.org/2000/svg";
const L={torso:62, neck:7, head:11, upper:30, fore:28, thigh:44, shin:43, foot:14};
const GROUND=262;
const BASE={x:200, t:0, hd:0, N:[0,0,90], F:[0,0,90], NA:[0,0], FA:[0,0], air:0, g:0, bx:0, by:0, bv:1};
const lerp=(a,b,u)=>a+(b-a)*u;
const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
const NONNUM=new Set(["hl","guide","snap","Fik","Nik"]);
function mix(p,q,u){ const o={}; for(const k in p){ const a=p[k],b=(q[k]===undefined?p[k]:q[k]);
  if(NONNUM.has(k)){ o[k]=(k==="Fik"||k==="Nik")&&Array.isArray(a)&&Array.isArray(b)?a.map((v,i)=>typeof v==="number"?lerp(v,b[i],u):v):a; continue; }
  if(Array.isArray(a)) o[k]=a.map((v,i)=>lerp(v,b[i],u)); else if(typeof a==="number") o[k]=lerp(a,b,u); else o[k]=u<.5?a:b; } return o; }
const dir=a=>{const r=a*Math.PI/180; return [Math.sin(r),Math.cos(r)];};
const seg=(p,a,len)=>{ const d=dir(a); return [p[0]+d[0]*len, p[1]+d[1]*len]; };
const angOf=(from,to)=>Math.atan2(to[0]-from[0], to[1]-from[1])*180/Math.PI; // absolute angle from down

// two-link IK: knee position for hip->ankle target; side=+1 knee toward +x, -1 toward -x, 0 = lower knee
function ik(hip,target,side){
  const dx=target[0]-hip[0], dy=target[1]-hip[1]; let d=Math.hypot(dx,dy); d=Math.min(d,L.thigh+L.shin-0.5);
  const base=Math.atan2(dy,dx), a=Math.acos(Math.max(-1,Math.min(1,(L.thigh*L.thigh+d*d-L.shin*L.shin)/(2*L.thigh*d))));
  const k1=[hip[0]+Math.cos(base+a)*L.thigh, hip[1]+Math.sin(base+a)*L.thigh];
  const k2=[hip[0]+Math.cos(base-a)*L.thigh, hip[1]+Math.sin(base-a)*L.thigh];
  if(side>0) return k1[0]>k2[0]?k1:k2; if(side<0) return k1[0]<k2[0]?k1:k2; return k1[1]>k2[1]?k1:k2;
}

function solve(P,view){
  const fr=view==="front";
  const hipC=[P.x,0];
  const tr=P.t*Math.PI/180, up=[Math.sin(tr),-Math.cos(tr)];
  const shC=[hipC[0]+up[0]*L.torso, hipC[1]+up[1]*L.torso];
  const across=[Math.cos(tr),Math.sin(tr)]; // perpendicular to torso (front view hips/shoulders)
  const off=(p,s,w)=>fr?[p[0]+across[0]*s*w, p[1]+across[1]*s*w]:[p[0],p[1]];
  const hN=off(hipC,1,9), hF=off(hipC,-1,9), sN=off(shC,1,15), sF=off(shC,-1,15);
  const ht=(P.t+P.hd)*Math.PI/180;
  const head=[shC[0]+Math.sin(ht)*(L.neck+L.head), shC[1]-Math.cos(ht)*(L.neck+L.head)];
  const flen=fr?7:L.foot;
  const leg=(h,A)=>{ const k=seg(h,A[0],L.thigh), an=seg(k,A[1],L.shin), toe=seg(an,A[2],flen); return {h,k,an,toe}; };
  const arm=(s,A)=>{ const e=seg(s,A[0],L.upper), w=seg(e,A[1],L.fore); return {s,e,w}; };
  const J={hip:hipC,sh:shC,head,hN,hF,sN,sF,N:leg(hN,P.N),F:leg(hF,P.F),NA:arm(sN,P.NA),FA:arm(sF,P.FA)};
  // ground snap
  const named={Nan:J.N.an,Ntoe:J.N.toe,Fan:J.F.an,Ftoe:J.F.toe,Nk:J.N.k,Fk:J.F.k,Nw:J.NA.w,Fw:J.FA.w,hip:hipC,sh:shC,Ne:J.NA.e,Fe:J.FA.e,head:[head[0],head[1]+L.head]};
  let keys=P.snap||Object.keys(named);
  if(P.Fik) keys=keys.filter(k=>k[0]!=="F"||k==="Fw"||k==="Fe");
  const low=Math.max(...keys.map(k=>named[k][1]));
  const dy=(GROUND-P.g)-low-P.air;
  const mv=p=>{p[1]+=dy;};
  [J.hip,J.sh,J.head,J.hN,J.hF,J.sN,J.sF].forEach(mv); ["N","F"].forEach(s=>{mv(J[s].k);mv(J[s].an);mv(J[s].toe);}); ["NA","FA"].forEach(s=>{mv(J[s].e);mv(J[s].w);});
  // far-leg IK: Fik=[dx from near ankle, lift above ground, footAngle, kneeSide]
  if(P.Fik){ const [dx,lift,fa,side]=P.Fik; const tgt=[J.N.an[0]+dx, GROUND-P.g-lift-P.air];
    const k=ik(J.hF,tgt,side||0); J.F.k=k; J.F.an=tgt; J.F.toe=seg(tgt,fa,flen); }
  return J;
}
function shiftJ(J,d){ const s=p=>{p[0]+=d;}; [J.head,J.hip,J.sh,J.hN,J.hF,J.sN,J.sF].forEach(s); ["N","F"].forEach(k=>{s(J[k].k);s(J[k].an);s(J[k].toe);}); ["NA","FA"].forEach(k=>{s(J[k].e);s(J[k].w);}); }
function pick(J,name){ const m={heel:J.N.an,knee:J.N.k,fknee:J.F.k,ankle:J.N.an,hip:J.hip,sh:J.sh,hand:J.NA.w,fhand:J.FA.w,elbow:J.NA.e,head:J.head,toe:J.N.toe,ftoe:J.F.toe}; return m[name]; }
function el(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
const txt=(parent,x,y,s,fill,size,anchor)=>{ const t=el("text",{x,y,fill:fill||"#2ec27e","font-size":size||12,"font-weight":700,"font-family":"system-ui,Arial","text-anchor":anchor||"start"},parent); t.textContent=s; return t; };

// ---------- player ----------
function DemoPlayer(container, def){
  const svg=el("svg",{viewBox:"0 0 400 300",width:"100%",height:"100%",preserveAspectRatio:"xMidYMid meet"});
  svg.style.display="block"; svg.style.background="#0b1622";
  container.innerHTML=""; container.appendChild(svg);
  const label=el("text",{x:200,y:291,"text-anchor":"middle",fill:"#ffb400","font-size":20,"font-weight":700,"font-family":"system-ui,Arial"});
  const sub=el("text",{x:200,y:22,"text-anchor":"middle",fill:"#9fb3c8","font-size":13,"font-family":"system-ui,Arial"});
  sub.textContent=def.sub||"";
  let speed=1, raf=0, clock=0, lastT=performance.now(), lastCap="";
  const total=(def.k||[]).reduce((s,f)=>s+f[0],0) || def.period || 2000;

  // Slow movements (avg phase >= 700 ms): show the live phase label, held at least 1.2 s so it can be read.
  // Fast cyclic movements: rotate the key cues every 3.5 s. Slow-mo always shows live phase labels.
  const avgPhase = def.k ? total/def.k.length : 9999;
  const synced = !def.cues || avgPhase>=700;
  let capSince=0;
  function caption(now,cap){
    let c;
    if(speed<=0.5 || synced){ c=cap!=null&&cap!==""?cap:lastCap; if(c!==lastCap && now-capSince<1200*(speed<=0.5?0:1)) c=lastCap; }
    else c=def.cues[Math.floor(now/3500)%def.cues.length];
    if(c!==lastCap){ label.textContent=c; lastCap=c; capSince=now; }
  }

  // ---- custom renderers (top-down drills, special views) ----
  if(def.render){
    const g=el("g",{},svg); svg.appendChild(sub); svg.appendChild(label);
    const tick=(now)=>{ const dt=now-lastT; lastT=now; clock+=dt*speed; const t=clock%total; g.innerHTML=""; const cap=def.render(g,t/total,{el,txt,GROUND}); caption(now,cap); raf=requestAnimationFrame(tick); };
    raf=requestAnimationFrame(tick);
    return {stop(){cancelAnimationFrame(raf);}, setSpeed(s){speed=s;}, svg};
  }

  // ---- figure renderer ----
  const view=def.view||"side";
  const scroll=el("g",{},svg);
  for(let i=0;i<12;i++) el("rect",{x:i*44,y:GROUND+6,width:22,height:3,fill:"#21384f",rx:1.5},scroll);
  el("line",{x1:0,y1:GROUND,x2:400,y2:GROUND,stroke:"#2c4a66","stroke-width":3},svg);
  const back=el("g",{},svg);           // walls, blocks, anchors
  const shadow=el("ellipse",{cx:200,cy:GROUND+2,rx:34,ry:5,fill:"#000",opacity:.35},svg);
  const behind=el("g",{},svg);         // props behind the figure (band lines)
  const sty=(c,w)=>({stroke:c,"stroke-width":w,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"});
  const far=el("g",sty("#5f86ad",9),svg), body=el("g",sty("#e9f1f8",10),svg), near=el("g",sty("#ffffff",10),svg);
  const fLeg=el("polyline",{},far), fArm=el("polyline",{},far);
  const torso=el("polyline",{},body);
  const head=el("circle",{r:L.head,fill:"#e9f1f8",stroke:"none"},svg);
  const nLeg=el("polyline",{},near), nArm=el("polyline",{},near);
  const propG=el("g",{},svg), hlG=el("g",{},svg);
  svg.appendChild(sub); svg.appendChild(label);
  // static scenery
  (def.blocks||[]).forEach(b=>el("rect",{x:b.x,y:GROUND-b.h,width:b.w,height:b.h,rx:3,fill:"#3b5d80",stroke:"#557aa0","stroke-width":2},back));
  if(def.door){ el("rect",{x:def.door,y:70,width:10,height:GROUND-70,fill:"#2a4560"},back); }

  const frames=def.k.map(([ms,p,cap])=>({ms,p:Object.assign({},BASE,def.base||{},p),cap}));
  const anchorX = def.anchor==="feet" ? solve(frames[0].p,view).N.an[0] : null;
  if(def.wall!=null){ let wx=def.wall; if(wx==="auto"){ const J0=solve(frames[0].p,view); if(anchorX!==null) shiftJ(J0,anchorX-J0.N.an[0]); wx=Math.max(J0.NA.w[0],J0.FA.w[0])+3; }
    el("rect",{x:wx,y:60,width:14,height:GROUND-60,fill:"#2a4560"},back); }

  function poseAt(t){ let acc=0;
    for(let i=0;i<frames.length;i++){ const f=frames[i], n=frames[(i+1)%frames.length];
      if(t<acc+f.ms){ const u=(t-acc)/f.ms; const P=f.p.cut?Object.assign({},f.p):mix(f.p,n.p,ease(u)); const nr=u<0.5?f:n; P.hl=nr.p.hl; P.guide=nr.p.guide; return {P,cap:nr.cap!==undefined?nr.cap:null}; }
      acc+=f.ms; }
    return {P:frames[0].p,cap:frames[0].cap}; }

  const pl=a=>a.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  function draw(now){
    const dtR=now-lastT; lastT=now; clock+=dtR*speed; const t=clock%total;
    const {P,cap}=poseAt(t);
    const J=solve(P,view);
    if(anchorX!==null) shiftJ(J,anchorX-J.N.an[0]);
    fLeg.setAttribute("points",pl([J.hF,J.F.k,J.F.an,J.F.toe]));
    nLeg.setAttribute("points",pl([J.hN,J.N.k,J.N.an,J.N.toe]));
    fArm.setAttribute("points",pl([J.sF,J.FA.e,J.FA.w]));
    nArm.setAttribute("points",pl([J.sN,J.NA.e,J.NA.w]));
    torso.setAttribute("points", view==="front" ? pl([J.hF,J.hN,J.hip,J.sh,J.sN,J.sF,J.sh]) : pl([J.hip,J.sh]));
    head.setAttribute("cx",J.head[0]); head.setAttribute("cy",J.head[1]);
    const lift=Math.max(0,P.air); shadow.setAttribute("rx",(34-lift*0.25).toFixed(1)); shadow.setAttribute("opacity",Math.max(.1,0.35-lift*0.003).toFixed(2)); shadow.setAttribute("cx",J.hip[0]);
    if(def.scroll){ const sp=typeof def.scroll==="number"?def.scroll:0; scrollX=(scrollX-dtR*speed*sp)%44; scroll.setAttribute("transform","translate("+scrollX+",0)"); }
    // props
    propG.innerHTML=""; behind.innerHTML="";
    const mid=[(J.NA.w[0]+J.FA.w[0])/2,(J.NA.w[1]+J.FA.w[1])/2];
    if(def.prop==="goblet"){ const hx=mid[0]+2, hy=mid[1]+14;
      el("rect",{x:hx-4,y:hy-20,width:8,height:30,rx:2,fill:"#8a9bb0"},propG);
      el("rect",{x:hx-11,y:hy-27,width:22,height:10,rx:3,fill:"#c8d3df"},propG);
      el("rect",{x:hx-11,y:hy+7,width:22,height:10,rx:3,fill:"#c8d3df"},propG); }
    if(def.prop==="db"){ [[J.FA.w,"#7f97ad"],[J.NA.w,"#c8d3df"]].forEach(([w,c])=>{ el("circle",{cx:w[0],cy:w[1]+3,r:8,fill:c},propG); el("circle",{cx:w[0],cy:w[1]+3,r:3,fill:"#4b6178"},propG); }); }
    if(def.ball && P.bv>0.05){ el("circle",{cx:mid[0]+P.bx,cy:mid[1]+P.by,r:def.ball,fill:"#c0563f",stroke:"#e58a6e","stroke-width":2,opacity:P.bv},propG); }
    if(def.band){ const a=def.band.at, w=def.band.hand==="F"?J.FA.w:(def.band.hand==="both"?null:J.NA.w);
      if(w) el("line",{x1:a[0],y1:a[1],x2:w[0],y2:w[1],stroke:"#e0a43a","stroke-width":4,"stroke-linecap":"round"},behind);
      else el("line",{x1:J.FA.w[0],y1:J.FA.w[1],x2:J.NA.w[0],y2:J.NA.w[1],stroke:"#e0a43a","stroke-width":5,"stroke-linecap":"round"},propG);
      if(w) el("circle",{cx:a[0],cy:a[1],r:5,fill:"#8a9bb0"},behind); }
    // guides
    hlG.innerHTML="";
    (P.guide||[]).forEach(g=>{
      const dash={stroke:"#2ec27e","stroke-width":2.5,"stroke-dasharray":"6 5"};
      if(g==="hipline"){ el("line",Object.assign({x1:J.hip[0],y1:J.hip[1],x2:J.hip[0],y2:GROUND},dash),hlG); txt(hlG,J.hip[0]+10,GROUND-8,"under the hip"); }
      if(g==="kneetoe"){ el("line",Object.assign({x1:J.N.k[0],y1:J.N.k[1],x2:J.N.k[0],y2:GROUND},dash),hlG); txt(hlG,J.N.k[0]+8,GROUND-8,"knee over toes"); }
      if(g==="impact"||g==="impactF"){ const f=g==="impact"?J.N:J.F; const cx=(f.an[0]+f.toe[0])/2;
        [[-14,-6],[-8,-12],[8,-12],[14,-6]].forEach(([dx,dy])=>el("line",{x1:cx+dx*0.4,y1:GROUND-2+dy*0.4,x2:cx+dx,y2:GROUND-2+dy,stroke:"#ffb400","stroke-width":3,"stroke-linecap":"round"},hlG)); }
      if(g==="tall"){ el("line",Object.assign({x1:J.N.an[0],y1:GROUND,x2:J.head[0],y2:J.head[1]-L.head},dash),hlG); }
      if(g==="flatback"){ el("line",Object.assign({x1:J.hip[0]-(J.sh[0]-J.hip[0])*0.25,y1:J.hip[1]-(J.sh[1]-J.hip[1])*0.25,x2:J.head[0]+(J.head[0]-J.hip[0])*0.12,y2:J.head[1]+(J.head[1]-J.hip[1])*0.12},dash),hlG); txt(hlG,J.sh[0]-6,J.sh[1]-18,"flat back","#2ec27e",12,"end"); }
      if(g==="bodyline"){ el("line",Object.assign({x1:J.N.an[0],y1:J.N.an[1],x2:J.head[0],y2:J.head[1]},dash),hlG); txt(hlG,J.hip[0],J.hip[1]-22,"straight line","#2ec27e",12,"middle"); }
      if(g==="backflat"){ el("line",Object.assign({x1:J.hip[0]-20,y1:GROUND-4,x2:J.sh[0]+20,y2:GROUND-4,stroke:"#2ec27e","stroke-width":4}),hlG); txt(hlG,(J.hip[0]+J.sh[0])/2,GROUND-14,"low back pressed down","#2ec27e",12,"middle"); }
      if(g==="vertical"){ el("line",Object.assign({x1:J.hip[0],y1:J.hip[1]+40,x2:J.hip[0],y2:J.head[1]-14},dash),hlG); txt(hlG,J.hip[0]+8,J.head[1]-16,"torso tall"); }
      if(g==="angle45"){ const a=J.N.an[0]<J.F.an[0]?J.N.an:J.F.an; el("line",Object.assign({x1:a[0],y1:a[1],x2:J.head[0],y2:J.head[1]},dash),hlG); txt(hlG,J.hip[0]-30,J.hip[1]+22,"45° line","#2ec27e",12,"end"); }
      if(g==="elbow90"){ txt(hlG,J.NA.e[0]+12,J.NA.e[1]+4,"90°"); }
    });
    (P.hl||def.hl||[]).forEach(name=>{ const p=pick(J,name); if(p) el("circle",{cx:p[0],cy:p[1],r:14,fill:"none",stroke:"#ffb400","stroke-width":3,opacity:.85},hlG); });
    caption(now,cap);
    raf=requestAnimationFrame(draw);
  }
  let scrollX=0;
  raf=requestAnimationFrame(draw);
  return {stop(){cancelAnimationFrame(raf);}, setSpeed(s){speed=s;}, svg};
}
global.DemoPlayer=DemoPlayer; global.DEMOS=global.DEMOS||{};
})(window);
