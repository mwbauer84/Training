Object.assign(window.DEMOS,{
  // A-SKIP — rhythm is "hop-step": the stance leg does a small hop while the swing knee rises to hip height
  // (thigh ~parallel, shin vertical under the knee, ankle dorsiflexed). The foot then paws actively down and
  // back so it strikes on the ball of the foot DIRECTLY UNDER THE HIP, not out in front. Tall posture, slight
  // lean from the ankles, elbows locked ~90°, opposite arm drives cheek-to-hip-pocket.
  askip:{sub:"side view · walk it first, then skip", scroll:0.07,
    cues:["Knee to waist height · toes up","Small hop forward at the top","Step down hard on the mid-foot, under the hip","Quick contact · rhythm, not distance"], k:[
    // Progression 1: A-march (walking version) — same angles, no hop, slower
    [520,{t:4, N:[88,2,100], F:[-2,-2,82], NA:[-40,50], FA:[55,145], hl:["knee","toe"]}, "A-march: knee up, toe up"],
    [380,{t:4, N:[-2,-1,82], F:[-2,-2,82], NA:[2,92], FA:[14,104], guide:["hipline"]}, "A-march: step down under the hip"],
    [520,{t:4, F:[88,2,100], N:[-2,-2,82], FA:[-40,50], NA:[55,145], hl:["fknee"]}, "A-march: knee up, toe up"],
    [380,{t:4, F:[-2,-1,82], N:[-2,-2,82], NA:[14,104], FA:[2,92], guide:["hipline"]}, "Now add the skip"],
    // Progression 2: A-skip — small forward hop at the peak, forceful mid-foot strike, quick contact
    ...Array.from({length:3}).flatMap(()=>[
      [250,{t:5, N:[88,2,100], F:[-6,-4,70], NA:[-40,50], FA:[55,145], air:10, hl:["knee","toe"]}, "Knee to waist · small hop"],
      [140,{t:5, N:[38,-8,90], F:[-4,-3,76], NA:[-10,80], FA:[25,115], air:4}, "Drive the foot down"],
      [110,{t:5, N:[-3,-2,80], F:[-2,-2,80], NA:[2,92], FA:[14,104], air:0, guide:["hipline","impact"]}, "Strike mid-foot under the hip"],
      [250,{t:5, F:[88,2,100], N:[-6,-4,70], FA:[-40,50], NA:[55,145], air:10, hl:["fknee"]}, "Knee to waist · small hop"],
      [140,{t:5, F:[38,-8,90], N:[-4,-3,76], FA:[-10,80], NA:[25,115], air:4}, "Drive the foot down"],
      [110,{t:5, F:[-3,-2,80], N:[-2,-2,80], NA:[14,104], FA:[2,92], air:0, guide:["hipline","impactF"]}, "Strike mid-foot under the hip"]
    ])
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
    [2400,{t:28, N:[88,-32,90], F:[86,-34,90], NA:[34,172], FA:[37,174], hl:["knee","heel"], guide:["kneetoe"]}, "Sit down between the heels"],
    [500,{t:28, N:[88,-32,90], F:[86,-34,90], NA:[34,172], FA:[37,174], hl:["knee","heel"], guide:["kneetoe"]}, "Bottom: chest proud, heels flat"],
    [1300,{t:2, N:[0,0,90], F:[0,0,90], NA:[6,160], FA:[9,162]}, "Drive up, stand tall"]
  ]}
});

// ---------------- helpers for common motions ----------------
const ease3=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
function runCycle(ms,lean,air){ const a=air||4; return [
  [ms,{t:lean, N:[60,-2,98], F:[-28,-95,-20], NA:[-40,40], FA:[48,135], air:a}],
  [ms*0.6,{t:lean, N:[10,-10,80], F:[30,-70,40], NA:[0,85], FA:[10,95], air:0}],
  [ms,{t:lean, F:[60,-2,98], N:[-28,-95,-20], FA:[-40,40], NA:[48,135], air:a}],
  [ms*0.6,{t:lean, F:[10,-10,80], N:[30,-70,40], NA:[10,95], FA:[0,85], air:0}] ]; }

Object.assign(window.DEMOS,{
  // ---------- WARM-UP ----------
  jog:{sub:"side view · relaxed, tall, easy rhythm", scroll:0.10,
    cues:["Relaxed shoulders","Tall posture","Land under the hips","Easy pace"], k:runCycle(300,6,4).map(f=>[f[0],f[1],"Easy jog"])},
  buildup:{sub:"side view · 70% then 90% · smooth, relaxed", scroll:0.22,
    cues:["Build smoothly — 70% then 90%","Tall, slight lean","Relaxed face and hands"], k:runCycle(190,10,6).map(f=>[f[0],f[1],"Build-up sprint"])},
  shuffle:(function(){
    // Foot-driven lateral shuffle: lead foot steps out first, trail leg pushes and glides in (never clicks),
    // hips travel smoothly and low. 3 steps right, plant, 3 steps left, plant.
    const S=650, T=900, NARROW=28, STRIDE=44, OUT=60, X0=114;
    const sm=u=>u<=0?0:u>=1?1:u*u*(3-2*u);
    const win=(u,a,b)=>sm((u-a)/(b-a));
    const arc=(u,a,b,h)=>(u>a&&u<b)?h*Math.sin(Math.PI*(u-a)/(b-a)):0;
    const segs=[]; let H=X0;
    for(let i=0;i<3;i++){ segs.push({k:"step",d:1,H,ms:S}); H+=STRIDE; }
    segs.push({k:"turn",d:1,H,ms:T});
    for(let i=0;i<3;i++){ segs.push({k:"step",d:-1,H,ms:S}); H-=STRIDE; }
    segs.push({k:"turn",d:-1,H,ms:T});
    const period=segs.reduce((s,x)=>s+x.ms,0);
    function gen(t){
      let acc=0, sg=segs[0]; for(const x of segs){ if(t<acc+x.ms){ sg=x; break; } acc+=x.ms; }
      const u=(t-acc)/sg.ms, d=sg.d, H=sg.H;
      let hip, lead, trail, lLift=0, tLift=0, lTilt=0, tTilt=0, hy, cap, guide=[], hl=[];
      if(sg.k==="step"){
        hip=H+d*STRIDE*u;                                   // hips glide at a steady speed
        lead=H+d*NARROW+d*STRIDE*win(u,0,0.4); lLift=arc(u,0,0.4,7);       // lead foot reaches out first
        trail=H-d*NARROW+d*STRIDE*win(u,0.5,0.95); tLift=arc(u,0.5,0.95,4); // trail foot glides in
        if(u>0.3&&u<0.55) tTilt=-25*Math.sin(Math.PI*(u-0.3)/0.25);         // heel peels up: push-off
        if(u<0.4) lTilt=12;
        hy=61-2.5*Math.cos(2*Math.PI*(u-0.45));
        if(u<0.32){ cap="Lead foot steps out first"; hl=[d>0?"ankle":"fankle"]; }
        else if(u<0.58){ cap="Trail leg pushes off"; guide=[d>0?"pushF":"pushN"]; hl=[d>0?"fankle":"ankle"]; }
        else cap="Trail foot slides in — never click";
      } else {
        // plant: outside foot steps wide, hips sink and stop, then push back the other way
        hip=H+d*7*Math.sin(Math.PI*Math.min(u/0.85,1));
        lead=H+d*NARROW+d*(OUT-NARROW)*win(u,0,0.3)-d*(OUT-NARROW)*win(u,0.55,1); lLift=arc(u,0,0.3,6)+arc(u,0.55,1,3);
        trail=H-d*NARROW;
        if(u>0.3&&u<0.6) lTilt=-20*Math.sin(Math.PI*(u-0.3)/0.3);
        hy=63.4-6*Math.sin(Math.PI*Math.min(u/0.7,1));
        if(u<0.3) cap="Plant the outside foot";
        else if(u<0.62){ cap="Push back the other way"; guide=[d>0?"pushN":"pushF"]; hl=[d>0?"ankle":"fankle"]; }
        else cap="Stay low";
      }
      const sway=(lead+trail)/2-hip;                       // shoulders stay level, tiny lean toward travel
      const swing=Math.sin(2*Math.PI*u)*4;
      const P={x:hip, t:sway*0.05, hy, air:0,
        feet: d>0 ? {N:[lead,lLift,lTilt],F:[trail,tLift,tTilt]} : {F:[lead,lLift,lTilt],N:[trail,tLift,tTilt]},
        NA:[28+swing,64], FA:[-28-swing,-64], guide, hl};
      return {P,cap};
    }
    return {view:"front", sub:"front view · low and wide · feet never click", period, gen,
      cues:["Lead foot steps out first","Trail leg pushes off","Feet never click together","Stay low — hips level"]};
  })(),
  carioca:{view:"front", sub:"front view · hips rotate, shoulders square",
    cues:["Trail leg crosses in front…","…then behind","Hips turn, shoulders stay square","Quick, light feet"], k:[
    [240,{x:150, t:0, N:[8,4,90], F:[-8,-4,-90], NA:[30,60], FA:[-30,-60]}, "Start"],
    [240,{x:175, t:0, N:[10,5,90], F:[28,18,-90], NA:[30,60], FA:[-30,-60], air:2}, "Cross in front"],
    [240,{x:205, t:0, N:[22,8,90], F:[-6,-3,-90], NA:[30,60], FA:[-30,-60]}, "Step out"],
    [240,{x:230, t:0, N:[10,5,90], F:[26,16,-90], NA:[30,60], FA:[-30,-60], air:2}, "Cross behind"],
    [240,{x:255, t:0, N:[22,8,90], F:[-6,-3,-90], NA:[30,60], FA:[-30,-60]}, "Step out"],
    [1,{x:150, cut:1, N:[8,4,90], F:[-8,-4,-90], NA:[30,60], FA:[-30,-60]}, ""]
  ]},
  lungerot:{sub:"side view · lunge, reach tall, rotate toward the front leg", anchor:"feet",
    cues:["Back knee hovers 1 in. off the ground","Front knee over mid-foot","Reach tall, then rotate to the front leg","Squeeze the back glute"], k:[
    [600,{t:0, N:[10,-8,90], Fik:[-70,10,60,0], NA:[0,10], FA:[0,10]}, "Step into the lunge"],
    [900,{t:0, N:[85,-6,90], Fik:[-70,10,60,0], NA:[175,180], FA:[170,175], hl:["fknee"]}, "Back knee hovers · reach tall"],
    [900,{t:-4, N:[85,-6,90], Fik:[-70,10,60,0], NA:[140,160], FA:[160,185], hl:["knee"]}, "Rotate toward the front leg"],
    [700,{t:0, N:[10,-8,90], Fik:[-70,10,60,0], NA:[0,10], FA:[0,10]}, "Stand and step through"]
  ]},
  wgs:{sub:"side view · lunge, elbow to instep, rotate and reach", anchor:"feet",
    cues:["Long lunge, back leg straight","Elbow to the inside of the front ankle","Rotate and reach to the ceiling","Shift hips back, straighten the front leg"], k:[
    [700,{t:5, N:[15,-8,90], Fik:[-95,8,60,0], NA:[0,10], FA:[0,10]}, "Long lunge"],
    [900,{t:68, N:[88,-10,90], Fik:[-95,8,60,0], NA:[10,-40], FA:[5,0], hl:["elbow"]}, "Elbow to the inside of the front ankle"],
    [1000,{t:60, N:[88,-10,90], Fik:[-95,8,60,0], NA:[175,180], FA:[5,0], hl:["hand"]}, "Rotate · reach to the ceiling"],
    [900,{t:78, N:[40,36,96], Fik:[-95,8,60,0], NA:[10,10], FA:[5,0]}, "Hips back · straighten the front leg"],
    [700,{t:5, N:[15,-8,90], Fik:[-95,8,60,0], NA:[0,10], FA:[0,10]}, "Stand, switch sides"]
  ]},
  inchworm:{sub:"side view · walk out, 1 push-up, walk the feet in", anchor:"feet",
    cues:["Hinge and put the hands down","Walk the hands out to a plank","One push-up","Walk the feet to the hands, legs straight"], k:[
    [700,{t:0, N:[0,0,90], F:[0,0,90], NA:[0,5], FA:[0,5]}, "Stand tall"],
    [800,{t:150, N:[8,0,90], F:[8,0,90], NA:[-6,-6], FA:[-4,-4]}, "Hinge, hands to the floor"],
    [900,{t:100, N:[-62,-62,-25], F:[-62,-62,-25], NA:[-2,-2], FA:[0,0], guide:["bodyline"]}, "Walk out to a plank"],
    [700,{t:96, N:[-80,-80,-15], F:[-80,-80,-15], NA:[2,2], FA:[4,4], guide:["bodyline"]}, "Plank: hands under shoulders"],
    [600,{t:92, N:[-86,-86,-10], F:[-86,-86,-10], NA:[-62,40], FA:[-60,42]}, "One push-up"],
    [600,{t:96, N:[-80,-80,-15], F:[-80,-80,-15], NA:[2,2], FA:[4,4]}, "Press up"],
    [1000,{t:150, N:[8,0,90], F:[8,0,90], NA:[-6,-6], FA:[-4,-4]}, "Walk the feet in, legs straight"]
  ]},
  pullapart:{sub:"top-down view · arms straight, squeeze the blades", period:4200,
    cues:["Arms straight at shoulder height","Pull the band to the chest","Shoulder blades together and down","Control the return"],
    render(g,u,{el,txt}){
      const ph = u<0.35 ? ease3(u/0.35) : (u<0.5 ? 1 : 1-ease3((u-0.5)/0.5));
      const cx=200, cy=120;
      el("ellipse",{cx,cy,rx:70,ry:24,fill:"#1c3450",stroke:"#5f86ad","stroke-width":3},g);
      el("circle",{cx,cy:cy-2,r:22,fill:"#e9f1f8"},g); txt(g,cx,cy+5,"head","#0b1622",11,"middle");
      const a=(8+ph*82)*Math.PI/180, len=105, sL=[cx-60,cy+4], sR=[cx+60,cy+4];
      const hL=[sL[0]-Math.sin(a)*len+ (1-ph)*42, sL[1]+Math.cos(a)*len], hR=[sR[0]+Math.sin(a)*len-(1-ph)*42, sR[1]+Math.cos(a)*len];
      el("line",{x1:hL[0],y1:hL[1],x2:hR[0],y2:hR[1],stroke:"#e0a43a","stroke-width":5},g);
      [[sL,hL],[sR,hR]].forEach(([s,h])=>el("line",{x1:s[0],y1:s[1],x2:h[0],y2:h[1],stroke:"#ffffff","stroke-width":12,"stroke-linecap":"round"},g));
      if(ph>0.85){ el("path",{d:`M ${cx-26} ${cy-30} L ${cx-8} ${cy-30} M ${cx+26} ${cy-30} L ${cx+8} ${cy-30}`,stroke:"#ffb400","stroke-width":4,"stroke-linecap":"round"},g); txt(g,cx,cy-40,"squeeze","#ffb400",12,"middle"); }
      txt(g,200,275,"front of body ↓","#9fb3c8",12,"middle");
      return u<0.35?"Pull apart":(u<0.5?"Squeeze, hold":"Slow return");
    }},
  // ---------- BLOCK 1 · DAY A ----------
  walldrill:{sub:"side view · 45° lean, drive the knee, toe up", wall:"auto",
    cues:["Straight line ear–hip–ankle at 45°","Knee drives up, thigh near parallel","Toe up, foot under the knee","Push the ground back, not down"], k:[
    [900,{t:45, N:[78,-18,82], F:[-45,-45,40], NA:[118,118], FA:[118,118], guide:["angle45"], hl:["knee"]}, "Set position: hold"],
    [550,{t:45, F:[78,-18,82], N:[-45,-45,40], NA:[118,118], FA:[118,118]}, "March: switch slowly"],
    [700,{t:45, F:[78,-18,82], N:[-45,-45,40], NA:[118,118], FA:[118,118], guide:["angle45"]}, "Hold the shape"],
    [550,{t:45, N:[78,-18,82], F:[-45,-45,40], NA:[118,118], FA:[118,118]}, "March: switch slowly"],
    [600,{t:45, N:[78,-18,82], F:[-45,-45,40], NA:[118,118], FA:[118,118]}, "Exchange on GO"],
    [130,{t:45, F:[78,-18,82], N:[-45,-45,40], NA:[118,118], FA:[118,118], hl:["fknee"]}, "Switch explosively"],
    [900,{t:45, F:[78,-18,82], N:[-45,-45,40], NA:[118,118], FA:[118,118], guide:["angle45"]}, "Freeze"]
  ]},
  twopoint:{sub:"side view · stay low for 3–5 steps", 
    cues:["Weight on the front foot","Explode — no false step back","Stay low for 3–5 steps","Rise gradually"], k:[
    [900,{x:110, t:38, N:[28,-18,88], F:[-30,-50,60], NA:[-55,-20], FA:[55,120], hl:["knee"]}, "2-point stance: weight on the front foot"],
    [220,{x:130, t:45, N:[-40,-40,30], F:[70,-5,95], NA:[50,130], FA:[-50,10], air:3}, "Drive the back knee"],
    [220,{x:165, t:42, N:[70,-5,95], F:[-42,-45,30], NA:[-50,10], FA:[50,130], air:3}, "Push the ground back"],
    [220,{x:205, t:36, F:[68,-5,95], N:[-40,-60,30], FA:[-45,30], NA:[50,130], air:4}, "Stay low"],
    [220,{x:245, t:28, N:[65,-5,95], F:[-35,-80,10], NA:[-45,35], FA:[48,132], air:5}, "Rise gradually"],
    [220,{x:285, t:20, F:[62,-4,96], N:[-30,-90,-10], FA:[-40,40], NA:[48,135], air:5}, ""],
    [1,{x:110, cut:1, t:38, N:[28,-18,88], F:[-30,-50,60], NA:[-55,-20], FA:[55,120]}, ""]
  ]},
  chestpass:{sub:"side view · outdoors, throw for distance at ~30°", ball:9,
    cues:["Athletic stance, ball at the chest","Dip, then step and push","Release out and up at 30°","Finish: arms long, thumbs down"], k:[
    [700,{t:12, N:[22,-8,90], F:[-18,-14,80], NA:[22,150], FA:[26,152], bx:6, by:4}, "Ball at the chest"],
    [380,{t:20, N:[40,-20,90], F:[-10,-30,80], NA:[30,150], FA:[34,152], bx:6, by:4}, "Dip"],
    [200,{x:212, t:8, N:[30,-6,90], F:[-30,-40,50], NA:[100,100], FA:[102,102], bx:8, by:0}, "Step and push"],
    [450,{x:214, t:6, N:[30,-6,90], F:[-30,-40,50], NA:[104,104], FA:[106,106], bx:170, by:-95}, "Out and up at 30°"],
    [500,{x:214, t:6, N:[30,-6,90], F:[-30,-40,50], NA:[100,100], FA:[102,102], bx:230, by:-110, bv:0, hl:["hand"]}, "Arms long, thumbs down"],
    [1,{x:200, cut:1, t:12, N:[22,-8,90], F:[-18,-14,80], NA:[22,150], FA:[26,152], bx:6, by:4, bv:1}, ""]
  ]},
  deadbug:{sub:"side view · low back stays pressed to the floor",
    base:{x:235, t:-90, snap:["hip","sh"], g:5},
    cues:["Low back pressed flat","Opposite arm and leg reach slowly","Exhale as you reach","Stop before the back arches"], k:[
    [700,{N:[180,90,180], F:[180,90,180], NA:[180,180], FA:[180,180], guide:["backflat"]}, "Table-top: knees and hips 90°"],
    [1300,{N:[96,96,186], F:[180,90,180], NA:[180,180], FA:[264,264], guide:["backflat"], hl:["knee"]}, "Reach the opposite arm and leg"],
    [900,{N:[180,90,180], F:[180,90,180], NA:[180,180], FA:[180,180]}, "Return"],
    [1300,{F:[96,96,186], N:[180,90,180], FA:[180,180], NA:[264,264], guide:["backflat"]}, "Other side"],
    [900,{N:[180,90,180], F:[180,90,180], NA:[180,180], FA:[180,180]}, "Return"]
  ]},
  rdl:{sub:"side view · push the hips back, flat back", prop:"db", anchor:"feet",
    cues:["Soft knees, DBs on the thighs","Push the hips straight back","Flat back · DBs slide down the legs","Squeeze the glutes to stand"], k:[
    [700,{t:0, N:[6,-4,90], F:[5,-5,90], NA:[0,0], FA:[0,0]}, "Tall, soft knees"],
    [2200,{t:72, N:[20,-4,90], F:[19,-5,90], NA:[-4,-4], FA:[-4,-4], guide:["flatback"], hl:["hip"]}, "Hips back · flat back"],
    [400,{t:72, N:[20,-4,90], F:[19,-5,90], NA:[-4,-4], FA:[-4,-4], guide:["flatback"]}, "Feel the hamstring stretch"],
    [1300,{t:0, N:[6,-4,90], F:[5,-5,90], NA:[0,0], FA:[0,0]}, "Squeeze the glutes to stand"]
  ]},
  split:{sub:"side view · back knee drops straight down", prop:"db", anchor:"feet",
    cues:["Long split stance, back heel up","Back knee drops straight down","Torso tall","Drive through the front heel"], k:[
    [700,{t:2, N:[22,-8,90], Fik:[-82,8,58,0], NA:[0,2], FA:[0,2]}, "Split stance, back heel up"],
    [1900,{t:2, N:[80,-8,90], Fik:[-82,8,58,0], NA:[0,2], FA:[0,2], guide:["vertical"], hl:["fknee"]}, "Back knee straight down"],
    [300,{t:2, N:[80,-8,90], Fik:[-82,8,58,0], NA:[0,2], FA:[0,2], guide:["vertical"]}, "1 in. off the floor"],
    [1200,{t:2, N:[22,-8,90], Fik:[-82,8,58,0], NA:[0,2], FA:[0,2], hl:["heel"]}, "Drive through the front heel"]
  ]},

  // Band external / internal rotation — top-down view (looking down on the athlete)
  erir:{sub:"top-down view · elbow pinned on the towel", period:6400,
    cues:["Towel between elbow and ribs","Elbow stays at 90°","Rotate out slowly · 3 s back","No torso twist"],
    render(g,u,{el,txt}){
      const ER=u<0.5, uu=(u%0.5)/0.5; const ph=Math.sin(uu*Math.PI*2*2-Math.PI/2)*0.5+0.5; // 2 reps per half
      const cx=200, cy=125;
      el("ellipse",{cx,cy,rx:78,ry:26,fill:"#1c3450",stroke:"#5f86ad","stroke-width":3},g);       // shoulders
      el("circle",{cx,cy:cy-2,r:22,fill:"#e9f1f8"},g);                                              // head
      txt(g,cx,cy+5,"head","#0b1622",11,"middle");
      const sh=[cx+66,cy], el1=[cx+70,cy+40];                                                        // right shoulder, elbow
      el("line",{x1:sh[0],y1:sh[1],x2:el1[0],y2:el1[1],stroke:"#ffffff","stroke-width":12,"stroke-linecap":"round"},g);
      el("rect",{x:el1[0]-16,y:el1[1]-8,width:14,height:18,rx:4,fill:"#2ec27e"},g); txt(g,el1[0]-20,el1[1]+30,"towel","#2ec27e",11,"end");
      // forearm angle: 0 = straight forward (down the screen), + = outward (+x)
      const a = ER ? (-35 + ph*105) : (70 - ph*105);
      const r=a*Math.PI/180, hand=[el1[0]+Math.sin(r)*72, el1[1]+Math.cos(r)*72];
      const anchor = ER ? [70,el1[1]+80] : [360,el1[1]+80];
      el("line",{x1:anchor[0],y1:anchor[1],x2:hand[0],y2:hand[1],stroke:"#e0a43a","stroke-width":4},g);
      el("rect",{x:anchor[0]-7,y:anchor[1]-7,width:14,height:14,fill:"#8a9bb0"},g);
      el("line",{x1:el1[0],y1:el1[1],x2:hand[0],y2:hand[1],stroke:"#ffffff","stroke-width":12,"stroke-linecap":"round"},g);
      el("circle",{cx:el1[0],cy:el1[1],r:15,fill:"none",stroke:"#ffb400","stroke-width":3},g);
      txt(g,200,275,"front of body ↓","#9fb3c8",12,"middle");
      txt(g,anchor[0],anchor[1]+24,"band anchor","#9fb3c8",11,"middle");
      return ER ? (ph>0.5?"External rotation: out":"Slow return (3 s)") : (ph>0.5?"Internal rotation: across the belly":"Slow return (3 s)");
    }},

  // ---------- COOL-DOWN ----------
  hipflexor:{sub:"side view · tuck the pelvis, squeeze the back glute", anchor:"feet",
    cues:["Tall, half-kneeling on a pad","Tuck: belt buckle to chin","Squeeze the down-knee glute","Shift forward slightly · 30 s each side"], k:[
    [1200,{t:0, N:[78,-2,90], Fik:[-62,0,-90,0], NA:[0,10], FA:[0,10]}, "Tall half-kneel"],
    [2400,{t:-4, N:[62,-14,90], Fik:[-62,0,-90,0], NA:[0,10], FA:[0,10], hl:["hip"]}, "Tuck the pelvis · shift forward"],
    [1200,{t:0, N:[78,-2,90], Fik:[-62,0,-90,0], NA:[0,10], FA:[0,10]}, "Breathe, hold 30 s"]
  ]},
  sleeper:{view:"front", sub:"front view · doorway pec stretch, gentle", door:118,
    cues:["Forearm on the door frame, elbow at shoulder height","Lean forward gently","Light stretch only — no pinching","30 s each side"], k:[
    [1400,{x:205, t:0, N:[4,0,90], F:[-4,0,-90], FA:[-90,-180], NA:[10,20]}, "Arm at 90/90 on the frame"],
    [2200,{x:215, t:4, N:[6,0,90], F:[-2,0,-90], FA:[-95,-185], NA:[10,20], hl:["fhand"]}, "Lean forward gently"],
    [1200,{x:205, t:0, N:[4,0,90], F:[-4,0,-90], FA:[-90,-180], NA:[10,20]}, "Hold, breathe"]
  ]}
});
