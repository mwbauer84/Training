// ================= Bauer Training — guided workout player =================
(function(){
"use strict";
const KEY = "bauerTrainer.v1";
const ATH = ["a14","a12"]; // display order
const $ = (s,el=document)=>el.querySelector(s);
const app = $("#app");

// ---------- storage ----------
function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){} }
const DB = load();
DB.settings = Object.assign({names:{a14:"14-yr",a12:"12-yr"}, voice:true, beeps:true, warmSec:40, circuitWork:40, circuitRest:20}, DB.settings||{});
DB.sessions = DB.sessions||[];
const S = DB.settings;
const nm = a => esc(S.names[a]||a);
function esc(t){ return String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// ---------- audio ----------
let actx=null;
function unlockAudio(){ try{ if(!actx){ const C=window.AudioContext||window.webkitAudioContext; if(C) actx=new C(); } if(actx&&actx.state==="suspended") actx.resume(); }catch(e){} }
function beep(f=880,d=0.12,v=0.25){ if(!S.beeps||!actx) return; try{ const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=f; o.type="square"; g.gain.value=v; o.connect(g); g.connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+d); o.stop(actx.currentTime+d+0.02);}catch(e){} }
function say(t){ if(!S.voice||!("speechSynthesis" in window)) return; try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=1; speechSynthesis.speak(u);}catch(e){} }
let wake=null;
async function keepAwake(){ try{ if("wakeLock" in navigator) wake=await navigator.wakeLock.request("screen"); }catch(e){} }
function releaseAwake(){ try{ wake&&wake.release(); wake=null; }catch(e){} }

// ---------- helpers ----------
function secsOf(reps){ const m=/(\d+)\s*s\b/.exec(reps||""); return m?+m[1]:0; }
function firstInt(reps){ const m=/(\d+)/.exec(reps||""); return m?+m[1]:0; }
function fmt(s){ s=Math.max(0,Math.ceil(s)); const m=Math.floor(s/60), r=s%60; return m+":"+String(r).padStart(2,"0"); }
function yt(id){ return "https://www.youtube.com/embed/"+id+"?autoplay=1&mute=1&loop=1&playlist="+id+"&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=0&origin="+encodeURIComponent(location.origin); }
function ytWatch(id){ return "https://www.youtube.com/watch?v="+id; }
function dayItems(b,day){ const B=BLOCKS[b]; if(day==="C"){ let c=B.C; if(c==="same5") c=BLOCKS[4].C; return c; } return B[day]; }

// ---------- build session steps ----------
function buildSteps(b, day){
  const steps=[];
  const W=S.warmSec;
  WARMUP.forEach(id=>{ if(day==="C"&&id==="buildup") return; steps.push({kind:"timed",sec: id==="buildup"?60:W, ex:id, seg:"Warm-up", dose:"follow along"}); });
  const plan=dayItems(b,day);
  if(plan && plan.type==="circuit"){
    const R14=4,R12=3, stations=plan.stations;
    for(let r=1;r<=R14;r++){
      stations.forEach((id,i)=>{
        steps.push({kind:"timed",sec:S.circuitWork,ex:id,seg:"Circuit",round:r,rounds:R14,r12:R12,dose:S.circuitWork+" s on / "+S.circuitRest+" s off"});
        const last = i===stations.length-1;
        steps.push({kind:"rest",sec: last? (r<R14?90:0) : S.circuitRest, seg:"Circuit", label: last?"Round "+r+" done":"Switch"});
      });
    }
  } else {
    const items = plan.type==="list" ? plan.items : plan;
    for(let i=0;i<items.length;i++){
      const it=items[i], slot=it[0];
      const nx=items[i+1];
      if(/^[AB]1$/.test(slot) && nx && nx[0]===slot[0]+"2"){
        const max=Math.max(it[3][0],it[4][0],nx[3][0],nx[4][0]);
        for(let s=1;s<=max;s++){ steps.push(workStep(it,s)); steps.push(workStep(nx,s)); steps.push({kind:"rest",sec:nx[5]||60,seg:segOf(slot),label:"Superset rest"}); }
        i++; continue;
      }
      const max=Math.max(it[3][0],it[4][0]);
      for(let s=1;s<=max;s++){ steps.push(workStep(it,s)); if(it[5]) steps.push({kind:"rest",sec:it[5],seg:segOf(slot),label:"Rest"}); }
    }
  }
  COOLDOWN.forEach(id=>steps.push({kind:"timed",sec:60,ex:id,seg:"Cool-down",dose:"30 s each side"}));
  // drop trailing / zero rests
  const out=steps.filter(s=>!(s.kind==="rest"&&!s.sec));
  out.forEach((s,i)=>{ if(s.kind==="rest"){ const n=out.slice(i+1).find(x=>x.kind!=="rest"); s.next=n; } });
  return out;
}
function segOf(slot){ return /^[AB]\d/.test(slot)?"Strength "+slot:slot; }
function workStep(it,set){
  const [slot,ex,note,d12,d14]=it;
  const dose={a12:d12,a14:d14};
  const t=Math.max(secsOf(d12[1]),secsOf(d14[1]));
  const perSide=/\/side/.test(d12[1]+d14[1]);
  return {kind: t?"timedset":"set", sec: t?t*(perSide?2:1):0, perSide, ex, note, slot, seg:segOf(slot), set, sets:Math.max(d12[0],d14[0]), dose};
}

// ---------- screens ----------
let view="home", sel={b:0,day:"A"}, run=null;

function render(){
  if(view==="home") return renderHome();
  if(view==="history") return renderHistory();
  if(view==="settings") return renderSettings();
  if(view==="player") return renderPlayer();
}

function renderHome(){
  const blocks=BLOCKS.map((B,i)=>`<button class="card ${i===sel.b?'on':''}" data-b="${i}"><div class="bn">Block ${i+1}</div><div class="bt">${esc(B.name)}</div><div class="bd">Wk ${B.weeks} · ${esc(B.dates)}</div></button>`).join("");
  const B=BLOCKS[sel.b];
  const days=["A","B","C"].map(d=>{ const ok=!!dayItems(sel.b,d); const lab={A:"Day A — Speed + Lower",B:"Day B — Agility + Upper",C:"Day C — Circuit (optional)"}[d]; return `<button class="day ${d===sel.day?'on':''}" data-day="${d}" ${ok?'':'disabled'}>${lab}${ok?'':' — none this block'}</button>`; }).join("");
  const plan=dayItems(sel.b,sel.day);
  let list="";
  if(plan){ const items= plan.type==="circuit"? plan.stations.map(id=>["Circuit",id,"",[3,"rounds"],[4,"rounds"]]) : (plan.type==="list"?plan.items:plan);
    list=items.map(it=>`<li><span class="sl">${esc(it[0])}</span> ${esc(EX[it[1]].n)}${it[2]?` <em>(${esc(it[2])})</em>`:""} <span class="ds">${nm("a14")}: ${it[4][0]}×${esc(it[4][1])} · ${nm("a12")}: ${it[3][0]}×${esc(it[3][1])}</span></li>`).join(""); }
  app.innerHTML=`
  <header class="top"><h1>Bauer Training</h1><nav><button data-go="history">History</button><button data-go="settings">Settings</button></nav></header>
  <section class="blocks">${blocks}</section>
  <section class="pick">
    <div class="goal"><b>Block ${sel.b+1}: ${esc(B.name)}.</b> ${esc(B.goal)}</div>
    <div class="days">${days}</div>
    <ol class="preview">${list}</ol>
    <button class="start" id="start" ${plan?'':'disabled'}>▶ Start Block ${sel.b+1} · Day ${sel.day}</button>
    <p class="hint">TV remote: ◀ ▶ previous/next step · OK = main button · ▲ ▼ move between buttons · ⏯ or Back = pause / menu</p>
  </section>`;
  app.querySelectorAll("[data-b]").forEach(e=>e.onclick=()=>{sel.b=+e.dataset.b; if(!dayItems(sel.b,sel.day)) sel.day="A"; render(); focusSel("[data-b='"+sel.b+"']");});
  app.querySelectorAll("[data-day]").forEach(e=>e.onclick=()=>{sel.day=e.dataset.day; render(); focusSel("#start");});
  app.querySelectorAll("[data-go]").forEach(e=>e.onclick=()=>{view=e.dataset.go; render();});
  $("#start").onclick=startSession;
}
function focusSel(q){ const e=$(q); if(e) e.focus(); }

function startSession(){
  unlockAudio(); keepAwake();
  const steps=buildSteps(sel.b,sel.day);
  const rec={id:Date.now(), date:new Date().toISOString(), block:sel.b+1, day:sel.day, logs:{}, done:false};
  DB.sessions.unshift(rec); save();
  run={steps, i:0, t:0, paused:false, rec, started:false, lastVid:null, timer:null};
  view="player";
  try{ history.pushState({p:1},""); }catch(e){}
  enterStep();
}

// ---------- player ----------
function cur(){ return run.steps[run.i]; }
function enterStep(){
  const st=cur();
  run.t = st.sec||0; run.started = (st.kind==="timed"||st.kind==="rest"); run.paused=false; run.half=false;
  render();
  announce(st);
  tick();
}
function announce(st){
  if(st.kind==="rest"){ const n=st.next; say((st.label||"Rest")+". "+st.sec+" seconds."+(n?" Next: "+EX[n.ex].n+".":"")); beep(520,0.15); }
  else if(st.kind==="timed"){ say(EX[st.ex].n+(st.round?". Round "+st.round:"")); beep(988,0.2); }
  else { say(EX[st.ex].n+". Set "+st.set+" of "+st.sets); }
}
function tick(){
  clearInterval(run&&run.timer);
  if(!run) return;
  let last=performance.now();
  run.timer=setInterval(()=>{
    if(!run) return;
    const st=cur(); const now=performance.now(); const dt=(now-last)/1000; last=now;
    if(run.paused||!run.started||!st.sec) return;
    const before=run.t; run.t-=dt;
    if(st.perSide && !run.half && run.t<=st.sec/2){ run.half=true; say("Switch sides"); beep(700,0.2); }
    if(Math.ceil(before)!==Math.ceil(run.t) && run.t>0 && run.t<=3.01){ beep(660,0.1); }
    if(run.t<=0){ run.t=0; beep(1046,0.35);
      if(st.kind==="timedset"){ run.started=false; updTimer(); doneSet(); return; }
      next(); return; }
    updTimer();
  },200);
}
function updTimer(){ const e=$("#clock"); if(e&&run) e.textContent=fmt(run.t); const p=$("#pause"); if(p) p.textContent=run.paused?"▶ Resume":"⏸ Pause"; }
function next(){ if(!run) return; if(run.i<run.steps.length-1){ run.i++; enterStep(); } else finish(); }
function prev(){ if(!run) return; if(run.i>0){ run.i--; enterStep(); } }
function togglePause(){ if(!run) return; run.paused=!run.paused; updTimer(); }

function primary(){
  const st=cur();
  if(st.kind==="set") return doneSet();
  if(st.kind==="timedset"){ if(!run.started){ run.started=true; beep(988,0.2); say("Go"); renderPrimaryLabel(); return; } return doneSet(); }
  next(); // timed / rest: skip
}
function renderPrimaryLabel(){ const b=$("#primary"); if(b) b.textContent=primaryLabel(cur()); }
function primaryLabel(st){
  if(st.kind==="set") return "✔ Set done";
  if(st.kind==="timedset") return run.started?"✔ Done":"▶ Start timer";
  if(st.kind==="rest") return "⏭ Skip rest";
  return "⏭ Skip";
}
function doneSet(){
  const st=cur(); const E=EX[st.ex];
  if(E.log){ openLog(st); } else next();
}

// ---------- logging ----------
function lastVals(ex,a){
  for(const s of DB.sessions){ if(s===run.rec) { const L=s.logs[ex]&&s.logs[ex][a]; if(L&&L.length) return L[L.length-1]; continue; }
    const L=s.logs[ex]&&s.logs[ex][a]; if(L&&L.length) return L[L.length-1]; }
  return null;
}
function openLog(st){
  const E=EX[st.ex];
  const rows=ATH.filter(a=>st.set<=st.dose[a][0]).map(a=>{
    const lv=lastVals(st.ex,a);
    const w = lv&&lv.w!=null?lv.w:(a==="a14"?20:10);
    const r = lv&&lv.r!=null&&lv.r>0?lv.r:firstInt(st.dose[a][1]);
    return {a,w,r};
  });
  if(!rows.length) return next();
  run.modal={rows, f:0, st};
  drawLog();
}
function drawLog(){
  const M=run.modal, E=EX[M.st.ex]; const fields=[];
  M.rows.forEach((row,ri)=>{ if(E.log==="wr") fields.push([ri,"w"]); fields.push([ri,"r"]); });
  M.fields=fields; if(M.f>=fields.length+2) M.f=0;
  let fi=0;
  const html=M.rows.map((row,ri)=>{
    const cell=(k,label,step)=>{ const idx=fi++; return `<div class="fld ${M.f===idx?'f':''}" data-fi="${idx}"><span>${label}</span><button class="mn" data-ri="${ri}" data-k="${k}" data-d="${-step}" tabindex="-1">−</button><b>${row[k]}${k==="w"?" lb":""}</b><button class="pl" data-ri="${ri}" data-k="${k}" data-d="${step}" tabindex="-1">+</button></div>`; };
    return `<div class="lrow"><div class="who">${nm(row.a)} <small>target ${esc(M.st.dose[row.a][1])}</small></div>${E.log==="wr"?cell("w","Weight",5):""}${cell("r","Reps",1)}</div>`;
  }).join("");
  const nF=fields.length;
  let ov=$("#modal"); if(!ov){ ov=document.createElement("div"); ov.id="modal"; document.body.appendChild(ov); }
  ov.innerHTML=`<div class="mbox"><h2>Log set ${M.st.set}: ${esc(E.n)}</h2>${html}
    <div class="mact"><button id="lsave" class="${M.f===nF?'f':''}">✔ Save & rest</button><button id="lskip" class="${M.f===nF+1?'f':''}">Skip logging</button></div>
    <p class="hint">▲ ▼ choose · ◀ ▶ change value · OK = save</p></div>`;
  ov.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{ adj(+b.dataset.ri,b.dataset.k,+b.dataset.d); });
  $("#lsave").onclick=saveLog; $("#lskip").onclick=()=>{ closeLog(); next(); };
}
function adj(ri,k,d){ const row=run.modal.rows[ri]; row[k]=Math.max(0,row[k]+d); drawLog(); }
function saveLog(){
  const M=run.modal; const L=run.rec.logs[M.st.ex]=run.rec.logs[M.st.ex]||{};
  M.rows.forEach(row=>{ (L[row.a]=L[row.a]||[]).push({set:M.st.set, w: EX[M.st.ex].log==="wr"?row.w:null, r:row.r}); });
  save(); closeLog(); next();
}
function closeLog(){ run.modal=null; const ov=$("#modal"); if(ov) ov.remove(); }

// ---------- player render ----------
function renderPlayer(){
  const st=cur(); const N=run.steps.length;
  const showEx = st.kind==="rest" ? (st.next&&st.next.ex) : st.ex;
  const E = showEx?EX[showEx]:null;
  let doseHtml="";
  if(st.kind==="set"||st.kind==="timedset"){
    doseHtml=ATH.map(a=>{ const d=st.dose[a]; const done=st.set>d[0]; return `<div class="dose ${done?'x':''}"><span>${nm(a)}</span><b>${done?"done ✓":esc(d[1])}</b><small>${done?"":"set "+st.set+" of "+d[0]}</small></div>`; }).join("");
  } else if(st.kind==="timed" && st.round){
    doseHtml=ATH.map(a=>{ const R=a==="a12"?st.r12:st.rounds; const done=st.round>R; return `<div class="dose ${done?'x':''}"><span>${nm(a)}</span><b>${done?"done ✓":esc(st.dose)}</b><small>${done?"":"round "+st.round+" of "+R}</small></div>`; }).join("");
  } else if(st.kind==="timed"){ doseHtml=`<div class="dose"><span>Both</span><b>${esc(st.dose)}</b></div>`; }
  const title = st.kind==="rest" ? `${esc(st.label||"Rest")}` : esc(E.n);
  const sub = st.kind==="rest" ? (E?`Up next: <b>${esc(E.n)}</b>`:"") : (st.note?esc(st.note):"");
  const setLine = (st.kind==="set"||st.kind==="timedset") ? `Set ${st.set} of ${st.sets}` : (st.round?`Round ${st.round} of ${st.rounds}`:"");
  const clock = (st.sec) ? `<div id="clock" class="clock ${st.kind==="rest"?'rest':''}">${fmt(run.t)}</div>` : `<div class="clock reps">Go at your pace</div>`;
  const cues = E? `<ul class="cues">${E.c.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>`:"";
  const vid = E&&E.v ? E.v : null;
  // Build the frame once per workout so the video iframe is never detached (detaching reloads it).
  if(!$(".player",app)){
    app.innerHTML=`
    <div class="player">
      <div class="pbar"><div id="pfill"></div></div>
      <header class="ptop" id="ptop"></header>
      <div class="pmain">
        <div class="vwrap" id="vwrap"></div>
        <div class="pinfo" id="pinfo"></div>
      </div>
      <footer class="ctrl">
        <button id="prev">◀ Back</button>
        <button id="primary" class="big"></button>
        <button id="pause"></button>
        <button id="next">Next ▶</button>
        <button id="exit">✕ End</button>
      </footer>
    </div>`;
    $("#prev").onclick=prev; $("#next").onclick=next; $("#pause").onclick=togglePause; $("#primary").onclick=primary; $("#exit").onclick=confirmExit;
    run.lastVid=undefined;
  }
  $(".player").classList.toggle("isrest", st.kind==="rest");
  $("#pfill").style.width=(run.i/(N-1))*100+"%";
  $("#ptop").innerHTML=`<span class="seg">${esc(st.seg||"")}</span><span>Block ${run.rec.block} · Day ${run.rec.day} · step ${run.i+1}/${N}</span>`;
  $("#pinfo").innerHTML=`
        <h2 class="ex">${title}</h2>
        ${sub?`<div class="sub">${sub}</div>`:""}
        ${setLine?`<div class="setl">${setLine}</div>`:""}
        ${clock}
        <div class="doses">${doseHtml}</div>
        ${cues}`;
  $("#primary").textContent=primaryLabel(st);
  $("#pause").textContent=run.paused?"▶ Resume":"⏸ Pause";
  const vw=$("#vwrap");
  const exId = showEx || null;
  if(exId!==run.lastVid){
    run.lastVid=exId;
    if(run.demo){ try{ run.demo.stop(); }catch(e){} run.demo=null; }
    const D = exId && window.DEMOS && window.DEMOS[exId];
    const tut = vid ? `<a class="vlink" href="${ytWatch(vid)}" target="_blank" rel="noopener" tabindex="-1">Full tutorial on YouTube</a>` : "";
    if(D){
      vw.innerHTML=`<div class="vbox demo" id="demobox"></div>${tut}`;
      run.demo = DemoPlayer($("#demobox"), D);
    } else {
      vw.innerHTML=`<div class="novid"><div>${E?esc(E.n):""}</div><small>Animated demo coming soon — follow the cues</small></div>${tut}`;
    }
  }
  $("#primary").focus();
}

function confirmExit(){
  if(!run) return;
  run.paused=true; updTimer();
  let ov=$("#modal"); if(!ov){ ov=document.createElement("div"); ov.id="modal"; document.body.appendChild(ov); }
  ov.innerHTML=`<div class="mbox"><h2>Paused</h2><div class="mact col"><button id="resume" class="f">▶ Resume workout</button><button id="end">✕ End and save</button></div></div>`;
  run.modal={exit:true, f:0};
  $("#resume").onclick=()=>{ closeLog(); run.paused=false; updTimer(); $("#primary")&&$("#primary").focus(); };
  $("#end").onclick=()=>{ closeLog(); finish(true); };
  $("#resume").focus();
}
function finish(early){
  clearInterval(run.timer); if(run.demo){ try{run.demo.stop();}catch(e){} } run.rec.done=!early; save(); releaseAwake();
  const rec=run.rec; run=null; say(early?"Workout saved.":"Workout complete. Nice work.");
  view="history"; render(); const el=$("[data-sid='"+rec.id+"']"); if(el) el.classList.add("hl");
}

// ---------- history ----------
function renderHistory(){
  const rows=DB.sessions.filter(s=>Object.keys(s.logs).length||s.done).map(s=>{
    const d=new Date(s.date);
    const ex=Object.keys(s.logs).map(id=>{ const L=s.logs[id]; return `<tr><td>${esc(EX[id]?EX[id].n:id)}</td>${ATH.map(a=>`<td>${(L[a]||[]).map(v=>(v.w!=null?v.w+"×":"")+v.r).join(", ")||"—"}</td>`).join("")}</tr>`; }).join("");
    return `<div class="sess" data-sid="${s.id}"><h3>${d.toLocaleDateString()} · Block ${s.block} Day ${s.day} ${s.done?"✓":"(partial)"}</h3>${ex?`<table><tr><th>Exercise</th>${ATH.map(a=>`<th>${nm(a)}</th>`).join("")}</tr>${ex}</table>`:"<p>No sets logged.</p>"}</div>`;
  }).join("") || "<p>No workouts yet.</p>";
  app.innerHTML=`<header class="top"><h1>History</h1><nav><button id="csv">⬇ Export CSV</button><button data-go="home">Home</button></nav></header><section class="hist">${rows}</section><p class="hint">Weights are lb × reps. Export works best on the Kindle; open the file in Google Sheets.</p>`;
  app.querySelectorAll("[data-go]").forEach(e=>e.onclick=()=>{view=e.dataset.go; render();});
  $("#csv").onclick=exportCSV; const b=$("[data-go='home']"); b&&b.focus();
}
function exportCSV(){
  const lines=[["date","block","day","athlete","exercise","set","weight_lb","reps"]];
  DB.sessions.forEach(s=>Object.keys(s.logs).forEach(id=>ATH.forEach(a=>(s.logs[id][a]||[]).forEach(v=>lines.push([s.date.slice(0,10),s.block,s.day,S.names[a],EX[id]?EX[id].n:id,v.set,v.w==null?"":v.w,v.r])))));
  const csv=lines.map(r=>r.map(x=>/[",]/.test(String(x))?'"'+String(x).replace(/"/g,'""')+'"':x).join(",")).join("\n");
  try{ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="bauer-training-log.csv"; document.body.appendChild(a); a.click(); a.remove(); }catch(e){}
}

// ---------- settings ----------
function renderSettings(){
  app.innerHTML=`<header class="top"><h1>Settings</h1><nav><button data-go="home">Home</button></nav></header>
  <section class="set">
   <label>Older son's name <input id="n14" value="${esc(S.names.a14)}" maxlength="16"></label>
   <label>Younger son's name <input id="n12" value="${esc(S.names.a12)}" maxlength="16"></label>
   <label><input type="checkbox" id="voice" ${S.voice?"checked":""}> Spoken cues</label>
   <label><input type="checkbox" id="beeps" ${S.beeps?"checked":""}> Countdown beeps</label>
   <label>Warm-up seconds per drill <input id="warm" type="number" min="20" max="90" value="${S.warmSec}"></label>
   <button id="ssave" class="start">Save</button>
   <button id="wipe" class="danger">Erase all logged workouts on this device</button>
   <p class="hint">Names and logs are stored only on this device. Use first names only.</p>
  </section>`;
  app.querySelectorAll("[data-go]").forEach(e=>e.onclick=()=>{view=e.dataset.go; render();});
  $("#ssave").onclick=()=>{ S.names.a14=$("#n14").value.trim()||"14-yr"; S.names.a12=$("#n12").value.trim()||"12-yr"; S.voice=$("#voice").checked; S.beeps=$("#beeps").checked; S.warmSec=Math.min(90,Math.max(20,+$("#warm").value||40)); save(); view="home"; render(); };
  let armed=false; $("#wipe").onclick=e=>{ if(!armed){ armed=true; e.target.textContent="Press again to erase everything"; return; } DB.sessions=[]; save(); e.target.textContent="Erased"; };
}

// ---------- remote / keyboard ----------
function focusables(){ const root=$("#modal")||app; return [...root.querySelectorAll("button:not([disabled]),input,a.card")].filter(e=>e.offsetParent!==null && e.tabIndex!==-1); }
function moveFocus(d){ const f=focusables(); if(!f.length) return; let i=f.indexOf(document.activeElement); i = i<0?0:(i+d+f.length)%f.length; f[i].focus(); }
document.addEventListener("keydown",e=>{
  const k=e.key;
  const isBack = k==="Escape"||k==="Backspace"||k==="GoBack"||k==="BrowserBack";
  const isPlay = k==="MediaPlayPause"||k==="MediaPlay"||k==="MediaPause"||k===" "&&view==="player";
  if(document.activeElement&&document.activeElement.tagName==="INPUT"&&!["ArrowUp","ArrowDown","Escape"].includes(k)) return;
  // log modal
  if(run&&run.modal&&!run.modal.exit){
    const M=run.modal, nF=M.fields.length;
    if(k==="ArrowDown"){ M.f=(M.f+1)%(nF+2); drawLog(); e.preventDefault(); return; }
    if(k==="ArrowUp"){ M.f=(M.f-1+nF+2)%(nF+2); drawLog(); e.preventDefault(); return; }
    if((k==="ArrowLeft"||k==="ArrowRight")&&M.f<nF){ const [ri,key]=M.fields[M.f]; adj(ri,key,(k==="ArrowRight"?1:-1)*(key==="w"?5:1)); e.preventDefault(); return; }
    if(k==="Enter"){ if(M.f===nF+1){ closeLog(); next(); } else saveLog(); e.preventDefault(); return; }
    if(isBack){ closeLog(); next(); e.preventDefault(); return; }
    e.preventDefault(); return;
  }
  if(view==="player"&&run){
    if(run.modal&&run.modal.exit){ if(k==="ArrowDown"||k==="ArrowUp"){ moveFocus(k==="ArrowDown"?1:-1); e.preventDefault(); } if(isBack){ $("#resume").click(); e.preventDefault(); } return; }
    if(k==="ArrowRight"){ next(); e.preventDefault(); return; }
    if(k==="ArrowLeft"){ prev(); e.preventDefault(); return; }
    if(k==="ArrowUp"||k==="ArrowDown"){ moveFocus(k==="ArrowDown"?1:-1); e.preventDefault(); return; }
    if(isPlay){ togglePause(); e.preventDefault(); return; }
    if(isBack){ confirmExit(); e.preventDefault(); return; }
    return;
  }
  if(k==="ArrowRight"||k==="ArrowDown"){ moveFocus(1); e.preventDefault(); }
  else if(k==="ArrowLeft"||k==="ArrowUp"){ moveFocus(-1); e.preventDefault(); }
  else if(isBack && view!=="home"){ view="home"; render(); e.preventDefault(); }
});
// Fire TV "Back" button navigates history: catch it during a workout
window.addEventListener("popstate",()=>{ if(view==="player"&&run){ try{ history.pushState({p:1},""); }catch(e){} if(!run.modal) confirmExit(); } });
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&run) keepAwake(); });

render();
setTimeout(()=>focusSel("#start"),50);
})();
