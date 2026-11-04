// ================= Exercise demo animations (SVG stick figure) =================
// Angles are absolute, in degrees, measured from straight DOWN; positive rotates toward +x
// (the direction the athlete faces in side view). Torso angle t is measured from straight UP.
(function(global){
"use strict";
const NS="http://www.w3.org/2000/svg";
const L={torso:62, neck:7, head:11, upper:30, fore:28, thigh:44, shin:43, foot:14};
const GROUND=262;

const BASE={x:200, t:0, hd:0, N:[0,0,90], F:[0,0,90], NA:[0,0], FA:[0,0], air:0, g:0};
const lerp=(a,b,u)=>a+(b-a)*u;
const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
function mix(p,q,u){ const o={}; for(const k in p){ const a=p[k],b=(q[k]===undefined?p[k]:q[k]); if(k==="hl"){ o[k]=a; continue; } if(Array.isArray(a)) o[k]=a.map((v,i)=>lerp(v,b[i],u)); else if(typeof a==="number") o[k]=lerp(a,b,u); else o[k]=u<.5?a:b; } return o; }
const dir=a=>{const r=a*Math.PI/180; return [Math.sin(r),Math.cos(r)];};
function seg(p,a,len){ const d=dir(a); return [p[0]+d[0]*len, p[1]+d[1]*len]; }

// forward kinematics -> joint positions (before ground snap)
function solve(P){
  const hip=[P.x,0];
  const tr=P.t*Math.PI/180, up=[Math.sin(tr),-Math.cos(tr)];
  const sh=[hip[0]+up[0]*L.torso, hip[1]+up[1]*L.torso];
  const ht=(P.t+P.hd)*Math.PI/180;
  const head=[sh[0]+Math.sin(ht)*(L.neck+L.head), sh[1]-Math.cos(ht)*(L.neck+L.head)];
  const leg=(A)=>{ const k=seg(hip,A[0],L.thigh), an=seg(k,A[1],L.shin), toe=seg(an,A[2],L.foot); return {hip,k,an,toe}; };
  const arm=(A)=>{ const e=seg(sh,A[0],L.upper), w=seg(e,A[1],L.fore); return {sh,e,w}; };
  const J={hip,sh,head,N:leg(P.N),F:leg(P.F),NA:arm(P.NA),FA:arm(P.FA)};
  // ground snap: lowest contact point sits on the ground (minus g for blocks), then lift by air
  const pts=[J.N.an,J.N.toe,J.F.an,J.F.toe,J.N.k,J.F.k,J.NA.w,J.FA.w,hip,sh,[head[0],head[1]+L.head]];
  const low=Math.max(...pts.map(p=>p[1]));
  const dy=(GROUND-P.g)-low-P.air;
  const sh2=p=>[p[0],p[1]+dy];
  const out={head:sh2(head),hip:sh2(hip),sh:sh2(sh)};
  ["N","F"].forEach(s=>out[s]={k:sh2(J[s].k),an:sh2(J[s].an),toe:sh2(J[s].toe)});
  ["NA","FA"].forEach(s=>out[s]={e:sh2(J[s].e),w:sh2(J[s].w)});
  return out;
}

function el(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }

// ---------- player ----------
function DemoPlayer(container, def){
  const svg=el("svg",{viewBox:"0 0 400 300",width:"100%",height:"100%",preserveAspectRatio:"xMidYMid meet"});
  svg.style.display="block"; svg.style.background="#0b1622";
  container.innerHTML=""; container.appendChild(svg);
  // backdrop
  const scroll=el("g",{},svg);
  for(let i=0;i<12;i++) el("rect",{x:i*44,y:GROUND+6,width:22,height:3,fill:"#21384f",rx:1.5},scroll);
  el("line",{x1:0,y1:GROUND,x2:400,y2:GROUND,stroke:"#2c4a66","stroke-width":3},svg);
  const shadow=el("ellipse",{cx:200,cy:GROUND+2,rx:34,ry:5,fill:"#000",opacity:.35},svg);
  const far=el("g",{stroke:"#5f86ad","stroke-width":9,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},svg);
  const body=el("g",{stroke:"#e9f1f8","stroke-width":10,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},svg);
  const near=el("g",{stroke:"#ffffff","stroke-width":10,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},svg);
  const fLeg=el("polyline",{},far), fArm=el("polyline",{},far);
  const torso=el("line",{},body);
  const head=el("circle",{r:L.head,fill:"#e9f1f8",stroke:"none"},svg);
  const nLeg=el("polyline",{},near), nArm=el("polyline",{},near);
  const hlG=el("g",{},svg);
  const label=el("text",{x:200,y:291,"text-anchor":"middle",fill:"#ffb400","font-size":20,"font-weight":700,"font-family":"system-ui,Arial"},svg);
  const sub=el("text",{x:200,y:22,"text-anchor":"middle",fill:"#9fb3c8","font-size":13,"font-family":"system-ui,Arial"},svg);

  // timeline
  const frames=def.k.map(([ms,p,cap])=>({ms,p:Object.assign({},BASE,p),cap}));
  const anchorX = def.anchor==="feet" ? solve(frames[0].p).N.an[0] : null;
  const propG=el("g",{},svg);
  const total=frames.reduce((s,f)=>s+f.ms,0);
  let start=performance.now(), raf=0, scrollX=0, lastT=start, speed=1, clock=0;

  function poseAt(t){
    let acc=0;
    for(let i=0;i<frames.length;i++){
      const f=frames[i], n=frames[(i+1)%frames.length];
      if(t<acc+f.ms){ const u=(t-acc)/f.ms; const P=mix(f.p,n.p,ease(u)); const near=u<0.5?f:n; P.hl=near.p.hl; P.guide=near.p.guide; return {P, cap:near.cap!==undefined?near.cap:null, i}; }
      acc+=f.ms;
    }
    return {P:frames[0].p,cap:frames[0].cap,i:0};
  }
  let lastCap="";
  function draw(now){
    const dtR=now-lastT; clock+=dtR*speed; const t=clock%total;
    const {P,cap}=poseAt(t);
    const J=solve(P);
    if(anchorX!==null){ const d=anchorX-J.N.an[0]; shiftJ(J,d); }
    const pl=(a)=>a.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
    fLeg.setAttribute("points",pl([J.hip,J.F.k,J.F.an,J.F.toe]));
    nLeg.setAttribute("points",pl([J.hip,J.N.k,J.N.an,J.N.toe]));
    fArm.setAttribute("points",pl([J.sh,J.FA.e,J.FA.w]));
    nArm.setAttribute("points",pl([J.sh,J.NA.e,J.NA.w]));
    torso.setAttribute("x1",J.hip[0]); torso.setAttribute("y1",J.hip[1]); torso.setAttribute("x2",J.sh[0]); torso.setAttribute("y2",J.sh[1]);
    head.setAttribute("cx",J.head[0]); head.setAttribute("cy",J.head[1]);
    const lift=Math.max(0,P.air); shadow.setAttribute("rx",(34-lift*0.25).toFixed(1)); shadow.setAttribute("opacity",(0.35-lift*0.003).toFixed(2)); shadow.setAttribute("cx",J.hip[0]);
    if(def.scroll){ const dt=dtR*speed; scrollX=(scrollX-dt*def.scroll)%44; scroll.setAttribute("transform","translate("+scrollX+",0)"); }
    lastT=now;
    // highlight rings on named joints
    hlG.innerHTML="";
    propG.innerHTML="";
    if(def.prop==="goblet"){ const hx=(J.NA.w[0]+J.FA.w[0])/2+2, hy=(J.NA.w[1]+J.FA.w[1])/2+14;
      el("rect",{x:hx-4,y:hy-20,width:8,height:30,rx:2,fill:"#8a9bb0"},propG);
      el("rect",{x:hx-11,y:hy-27,width:22,height:10,rx:3,fill:"#c8d3df"},propG);
      el("rect",{x:hx-11,y:hy+7,width:22,height:10,rx:3,fill:"#c8d3df"},propG); }
    (P.guide||[]).forEach(g=>{
      if(g==="hipline"){ el("line",{x1:J.hip[0],y1:J.hip[1],x2:J.hip[0],y2:GROUND,stroke:"#2ec27e","stroke-width":2.5,"stroke-dasharray":"6 5"},hlG); el("text",{x:J.hip[0]+10,y:GROUND-8,fill:"#2ec27e","font-size":12,"font-family":"system-ui,Arial","font-weight":700},hlG).textContent="under the hip"; }
      if(g==="kneetoe"){ el("line",{x1:J.N.k[0],y1:J.N.k[1],x2:J.N.k[0],y2:GROUND,stroke:"#2ec27e","stroke-width":2.5,"stroke-dasharray":"6 5"},hlG); el("text",{x:J.N.k[0]+8,y:GROUND-8,fill:"#2ec27e","font-size":12,"font-family":"system-ui,Arial","font-weight":700},hlG).textContent="knee over toes"; }
      if(g==="tall"){ el("line",{x1:J.N.an[0],y1:GROUND,x2:J.head[0],y2:J.head[1]-L.head,stroke:"#2ec27e","stroke-width":2.5,"stroke-dasharray":"6 5"},hlG); }
    });
    (P.hl||def.hl||[]).forEach(name=>{ const p=pick(J,name); if(p) el("circle",{cx:p[0],cy:p[1],r:14,fill:"none",stroke:"#ffb400","stroke-width":3,opacity:.85},hlG); });
    // Phase captions only when slowed down; at normal speed rotate the key cues slowly so they can be read.
    let c;
    if(speed<=0.5 || !def.cues) c=cap!==null?cap:lastCap;
    else c=def.cues[Math.floor(now/3500)%def.cues.length];
    if(c!==lastCap){ label.textContent=c; lastCap=c; }
    svg.appendChild(propG); svg.appendChild(hlG); svg.appendChild(label);
    raf=requestAnimationFrame(draw);
  }
  sub.textContent=def.sub||"";
  raf=requestAnimationFrame(draw);
  return {stop(){cancelAnimationFrame(raf);}, setSpeed(s){speed=s;}, svg};
}
function shiftJ(J,d){ const s=p=>{p[0]+=d;}; [J.head,J.hip,J.sh].forEach(s); ["N","F"].forEach(k=>{s(J[k].k);s(J[k].an);s(J[k].toe);}); ["NA","FA"].forEach(k=>{s(J[k].e);s(J[k].w);}); }
function pick(J,name){ const m={heel:[J.N.an[0],J.N.an[1]],knee:J.N.k,fknee:J.F.k,ankle:J.N.an,hip:J.hip,sh:J.sh,hand:J.NA.w,head:J.head,toe:J.N.toe}; return m[name]; }

// ---------- demo library ----------
// pose shorthand: N/F legs [thigh, shin, foot]; NA/FA arms [upper, forearm]
const DEMOS={
  // A-SKIP — rhythm is "hop-step": the stance leg does a small hop while the swing knee rises to hip height
  // (thigh ~parallel, shin vertical under the knee, ankle dorsiflexed). The foot then paws actively down and
  // back so it strikes on the ball of the foot DIRECTLY UNDER THE HIP, not out in front. Tall posture, slight
  // lean from the ankles, elbows locked ~90°, opposite arm drives cheek-to-hip-pocket.
  askip:{sub:"side view · hop-step rhythm · strike under the hip", scroll:0.07, cues:["Knee to hip height · toe up","Paw down and back","Ball of foot lands under the hip","Tall · opposite arm drives"], k:[
    [230,{t:4, N:[88,2,100], F:[-4,-3,72], NA:[-40,50], FA:[55,145], air:7, hl:["knee","toe"]}, "Knee to hip height · toe up"],
    [150,{t:4, N:[40,-8,92], F:[-4,-3,72], NA:[-10,80], FA:[25,115], air:3}, "Paw down and back"],
    [170,{t:4, N:[-3,-2,72], F:[-2,-2,74], NA:[2,92], FA:[14,104], air:0, guide:["hipline"]}, "Ball of foot lands under the hip"],
    [230,{t:4, F:[88,2,100], N:[-4,-3,72], FA:[-40,50], NA:[55,145], air:7, hl:["fknee"]}, "Knee to hip height · toe up"],
    [150,{t:4, F:[40,-8,92], N:[-4,-3,72], FA:[-10,80], NA:[25,115], air:3}, "Paw down and back"],
    [170,{t:4, F:[-3,-2,72], N:[-2,-2,74], NA:[2,92], FA:[14,104], air:0, guide:["hipline"]}, "Ball of foot lands under the hip"]
  ]},
  // SQUAT JUMP (stick) — feet hip-to-shoulder width; fast countermovement to a quarter/half squat with arms
  // swinging back; drive the arms up and fully extend ankles, knees and hips (toes point at takeoff); land
  // forefoot-to-heel, absorb into a quarter/half squat with hips back, chest up, knees over (not past/inside)
  // the toes; arms forward for balance; hold the stick 2 s, then reset fully before the next rep.
  squatjump:{sub:"side view · triple extension · soft, quiet stick", cues:["Load fast: hips back, arms back","Explode: ankles, knees, hips extend","Land soft, forefoot first","Stick it: knees over toes, hold 2 s"], k:[
    [650,{t:2, N:[0,0,90], F:[0,0,90], NA:[0,4], FA:[0,4], guide:["tall"]}, "Tall, feet hip-width"],
    [380,{t:42, N:[72,-28,90], F:[70,-30,90], NA:[-100,-92], FA:[-108,-100], hl:["hip"]}, "Load fast: hips back, arms back"],
    [170,{t:6, N:[-2,-6,32], F:[-4,-8,32], NA:[165,170], FA:[160,165], air:2, hl:["ankle"]}, "Drive: ankles, knees, hips extend"],
    [330,{t:2, N:[4,-2,30], F:[2,-4,30], NA:[178,180], FA:[172,175], air:30}, "Toes point · reach high"],
    [170,{t:4, N:[12,-6,62], F:[10,-8,62], NA:[110,130], FA:[105,125], air:3}, "Land forefoot first"],
    [1500,{t:34, N:[64,-26,90], F:[62,-28,90], NA:[75,95], FA:[70,90], air:0, hl:["knee","hip"], guide:["kneetoe"]}, "Stick it 2 s: hips back, chest up, quiet"],
    [550,{t:6, N:[8,-4,90], F:[6,-6,90], NA:[10,20], FA:[8,18]}, "Stand up, reset"]
  ]},
  // B-SKIP — an A-skip plus a leg "unfold": knee to hip height, then extend the lower leg forward (toe stays up),
  // then actively claw the straight-ish leg down and BACK (hamstrings) so the ball of the foot strikes under the hip.
  // Stance leg hops; tall posture; elbows ~90°, opposite arm drives.
  bskip:{sub:"side view · knee up, unfold, claw back", scroll:0.07,
    cues:["Knee to hip height · toe up","Unfold: extend the lower leg forward","Claw down and back","Ball of foot lands under the hip"], k:[
    [210,{t:4, N:[88,2,100], F:[-4,-3,72], NA:[-40,50], FA:[55,145], air:7, hl:["knee"]}, "Knee up"],
    [190,{t:4, N:[78,70,104], F:[-4,-3,72], NA:[-40,50], FA:[55,145], air:6, hl:["toe"]}, "Unfold · toe up"],
    [170,{t:4, N:[28,22,88], F:[-4,-3,72], NA:[-10,80], FA:[25,115], air:2}, "Claw down and back"],
    [170,{t:4, N:[-3,-2,72], F:[-2,-2,74], NA:[2,92], FA:[14,104], air:0, guide:["hipline"]}, "Lands under the hip"],
    [210,{t:4, F:[88,2,100], N:[-4,-3,72], FA:[-40,50], NA:[55,145], air:7, hl:["fknee"]}, "Knee up"],
    [190,{t:4, F:[78,70,104], N:[-4,-3,72], FA:[-40,50], NA:[55,145], air:6}, "Unfold · toe up"],
    [170,{t:4, F:[28,22,88], N:[-4,-3,72], FA:[-10,80], NA:[25,115], air:2}, "Claw down and back"],
    [170,{t:4, F:[-3,-2,72], N:[-2,-2,74], NA:[14,104], FA:[2,92], air:0, guide:["hipline"]}, "Lands under the hip"]
  ]},
  // GOBLET SQUAT — DB held vertically, hands cupped under the top head, elbows down; brace; sit DOWN between the
  // heels (hips back and down together), torso fairly upright, knees travel forward over the toes, heels flat;
  // depth = thighs at/below parallel with elbows inside the knees and a neutral spine; drive up through mid-foot.
  // Tempo: 2–3 s down, brief pause, stand up.
  goblet:{sub:"side view · sit down between the heels", prop:"goblet", anchor:"feet",
    cues:["Brace: DB at chest, elbows down","Sit down between the heels · 3 s","Chest proud · heels flat · knees over toes","Drive up through the whole foot"], k:[
    [800,{t:2, N:[0,0,90], F:[0,0,90], NA:[6,160], FA:[9,162]}, "Brace, DB at the chest"],
    [2400,{t:30, N:[96,-36,90], F:[94,-38,90], NA:[34,172], FA:[37,174], hl:["knee","heel"], guide:["kneetoe"]}, "Sit down between the heels"],
    [500,{t:30, N:[96,-36,90], F:[94,-38,90], NA:[34,172], FA:[37,174], hl:["knee","heel"], guide:["kneetoe"]}, "Bottom: chest proud, heels flat"],
    [1300,{t:2, N:[0,0,90], F:[0,0,90], NA:[6,160], FA:[9,162]}, "Drive up, stand tall"]
  ]}
};

global.DemoPlayer=DemoPlayer; global.DEMOS=DEMOS;
})(window);
