import{C as G,W as Be,S as De,a as ke,V as N,B as Ie,b as W,c as Ve,d as me,e as pe,P as Oe,M as oe}from"./three.module-DhKp4gPc.js";import{v as Ae,ab as $e,H as He,y as Le,S as Ye,J as R,I as Ee,an as qe,ak as We,_ as Ne,m as fe,al as Ge,ax as ve,c as Xe,o as Ue,e as ne,i as je,ap as Ke,F as Je,ao as Ze,af as we,ay as Qe,aq as et,az as tt,aA as ge,at as ot,ah as ye,ag as nt}from"./index-CoQKB6gy.js";import{a as xe,b as at,l as Z,c as rt}from"./useSeal-BfnaYHFZ.js";import{S as st,a as it,F as ae}from"./forms-CN07Ko8p.js";let z=0,Se=0;function lt(){const C=performance.now();return xe.value&&!z&&(z=C),!xe.value&&z&&(Se+=C-z,z=0),Se+(z?C-z:0)}const Q=new G(Ye),ct=new G(qe),ut=new G(Ee).lerp(Q,.3);function ht(C,{maxPixelRatio:ee=2,setup:X,update:k}){const{add:U,remove:j}=He(),c=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let x,f,S,P,E,I=!1;const _=performance.now(),b=Q.clone();let B=Q;const v={x:.5,y:.5,tx:.5,ty:.5};let D=0,F=0;const V=()=>{const A=document.documentElement;A.classList.contains("is-source")?B=ut:B=A.dataset.theme==="light"?ct:Q},K=A=>{v.tx=A.clientX/window.innerWidth,v.ty=1-A.clientY/window.innerHeight,F=1},O=()=>{F=0},T=()=>{x.setSize(window.innerWidth,window.innerHeight,!1)},$=()=>{v.x+=(v.tx-v.x)*.08,v.y+=(v.ty-v.y)*.08,D+=(F-D)*.05,b.lerp(B,.06),k(P,{time:c?0:(performance.now()-_-lt())/1e3,scroll:R.scrollY/window.innerHeight,viewport:{width:window.innerWidth,height:window.innerHeight},mouse:v,hover:D,color:b,size:x.getDrawingBufferSize(new N),pixelRatio:x.getPixelRatio()}),x.render(f,S)};Ae(async()=>{if(!$e()){document.documentElement.classList.add("no-webgl");return}try{x=new Be({canvas:C.value,alpha:!0,antialias:!1})}catch{document.documentElement.classList.add("no-webgl");return}x.setPixelRatio(Math.min(window.devicePixelRatio,ee)),f=new De,S=new ke,P=await X({renderer:x,scene:f,camera:S}),!I&&(T(),V(),b.copy(B),E=new MutationObserver(V),E.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.addEventListener("resize",T),window.addEventListener("pointermove",K,{passive:!0}),document.documentElement.addEventListener("pointerleave",O),U($))}),Le(()=>{I=!0,j($),E?.disconnect(),window.removeEventListener("resize",T),window.removeEventListener("pointermove",K),document.documentElement.removeEventListener("pointerleave",O),f?.traverse(A=>A.geometry?.dispose()),P?.dispose(),x?.dispose()})}const dt=`
  uniform vec4 uFrom;       // centre x, centre y (CSS px, y down), size px, kind (0 portrait)
  uniform vec4 uTo;
  uniform vec2 uFromRot;
  uniform vec2 uToRot;
  uniform float uFromAlpha;
  uniform float uToAlpha;
  uniform float uMix;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSpacing;
  uniform float uDot;
  uniform vec2 uViewport;
  uniform vec2 uMouse;      // CSS px, y down
  uniform float uHover;
  uniform vec3 uLens;       // open hover lens: centre x, y (CSS px, y down), radius
  uniform float uLensMax;
  uniform float uLensDot;
  uniform vec3 uReveal;     // hero portrait reveal: centre x, y (CSS px, y down), radius
  uniform float uSwirl;     // how far dots swing out mid-flight (viewport heights)
  uniform float uMist;      // writing the footer name: 1 (the hero's line always is)
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aLum;
  attribute vec3 aSeed;
  varying float vLum;
  varying float vSeed;
  varying float vAlpha;

  const float CAMERA = 2.2;

  ${We}

  // Lower part of the portrait thins out so the hero name behind it shows
  // through: y in portrait heights, -0.5 at the bottom edge
  float portraitFade(float y) {
    return mix(0.12, 1.0, smoothstep(-0.5, -0.12, y));
  }

  vec3 rotate(vec3 p, vec2 r) {
    float cy = cos(r.y), sy = sin(r.y);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    float cx = cos(r.x), sx = sin(r.x);
    return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  }

  // -> screen xy, point size, alpha
  vec4 place(vec3 local, vec4 frame, vec2 rot, float alpha) {
    vec3 p = rotate(local, rot);
    p.z = min(p.z, CAMERA - 0.3);
    float persp = CAMERA / (CAMERA - p.z);
    vec2 screen = frame.xy + vec2(p.x, -p.y) * persp * frame.z;
    if (frame.w < 0.5) return vec4(screen, uSpacing * (0.3 + aLum * 0.95) * persp, alpha * portraitFade(local.y));
    // Forms: nearer dots bigger and brighter
    float shade = clamp(0.55 + p.z * 1.4, 0.2, 1.0);
    return vec4(screen, uDot * (0.6 + aSeed.y * 0.8) * persp, alpha * shade);
  }

  // The figure at rest isn't still: it breathes and sways (more towards the
  // head), a faint shimmer rises through it, and its brighter, nearer dots
  // lean towards the pointer more than the darker ones, for a little depth
  vec2 idle() {
    float h = aFrom.y + 0.5; // 0 at the feet, 1 at the head
    vec2 o = vec2(sin(uTime * 0.45) * 4.0 * h, -sin(uTime * 1.1) * 3.0 * h);
    o.x += sin(aFrom.y * 16.0 - uTime * 1.8 + aSeed.z * 2.0) * 1.4 * smoothstep(0.1, 0.9, h);
    o += (uMouse - uFrom.xy) / uViewport * (aLum - 0.4) * 28.0;
    return o;
  }

  void main() {
    vec3 dir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
    // Writing the name (leaving the portrait, and at the footer) the dots set
    // off all at once, slowly, as a cloud that condenses into the letters;
    // elsewhere they set off at staggered moments
    bool fromPortrait = uFrom.w < 0.5;
    bool mist = fromPortrait || uMist > 0.5;
    float order = aSeed.x * (mist ? 0.3 : 0.45);
    float raw = clamp((uMix - order) / (mist ? 0.7 : 0.55), 0.0, 1.0);
    float t = easeInOut(raw);
    float flight = sin(t * 3.1416);

    vec4 a = place(aFrom, uFrom, uFromRot, uFromAlpha);
    if (fromPortrait) a.xy += idle();
    vec4 b = place(aTo, uTo, uToRot, uToAlpha);
    vec2 screen = mix(a.xy, b.xy, t);
    // Swing outwards mid-flight
    screen += dir.xy * flight * uViewport.y * uSwirl;
    float size = mix(a.z, b.z, t);
    float alpha = mix(a.w, b.w, t);
    // Mist: dots swell and thin out mid-flight, as the figure turns to vapour
    if (mist) {
      size *= 1.0 + flight * 0.6;
      alpha *= 1.0 - flight * 0.45;
    }
    // At the footer the cloud rises first, then drops into the letters
    if (uMist > 0.5) screen.y -= flight * uViewport.y * 0.2;

    // Intro: gather from a scattered cloud when the preloader lifts
    float p = clamp((uProgress - aSeed.x * 0.6) / 0.4, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec2 scattered = uViewport * 0.5 + dir.xy * uViewport.y * (0.4 + aSeed.y * 0.6);
    screen = mix(scattered, screen, p);
    alpha *= 0.4 + 0.6 * p;

    screen += vec2(sin(uTime * 0.8 + aSeed.y * 6.2832), cos(uTime * 0.7 + aSeed.z * 6.2832)) * 1.2;

    // Hover lens: dots peel off the form (staggered) and fill the circle
    // evenly, slowly swirling, with a few sparks just outside the edge
    float lensMix = clamp(clamp(uLens.z / uLensMax, 0.0, 1.0) * 1.4 - aSeed.x * 0.4, 0.0, 1.0);
    lensMix = lensMix * lensMix * (3.0 - 2.0 * lensMix);
    float angle = aSeed.z * 6.2832 + uTime * 0.25 * (aSeed.y - 0.5);
    float radius = uLens.z * (sqrt(aSeed.y) * 0.97 + 0.08 * step(0.93, aSeed.x) * aSeed.z);
    screen = mix(screen, uLens.xy + vec2(cos(angle), sin(angle)) * radius, lensMix);
    size = mix(size, uLensDot, lensMix);
    // Over 1 to cancel the fragment shader's paper-chapter dimming: the disc
    // is the lens's fill, so it must stay solid enough to read text on
    alpha = mix(alpha, 1.7, lensMix);

    vec2 diff = screen - uMouse;
    float force = smoothstep(130.0, 0.0, length(diff)) * uHover * (1.0 - lensMix);
    screen += normalize(diff + 0.0001) * force * 40.0;

    // Portrait reveal: dots inside the circle scatter out and fade, so the
    // photo behind shows through (portrait only, i.e. before the first morph)
    float reveal = step(uFrom.w, 0.5) * (1.0 - t) * smoothstep(uReveal.z, uReveal.z * 0.4, length(screen - uReveal.xy));
    screen += normalize(screen - uReveal.xy + 0.0001) * reveal * 24.0;
    alpha *= 1.0 - reveal * 0.95;

    gl_Position = vec4(screen.x / uViewport.x * 2.0 - 1.0, 1.0 - screen.y / uViewport.y * 2.0, 0.0, 1.0);
    gl_PointSize = size * (1.0 + force * 0.6);

    vLum = mix(mix(uFrom.w < 0.5 ? aLum : 0.85, uTo.w < 0.5 ? aLum : 0.85, t), 1.0, lensMix);
    vSeed = aSeed.x;
    vAlpha = alpha;
  }
`,mt=["src"],pt=.2,ft=.03,vt=6,Me=2.6,wt=1.04,gt=.06,yt=.36,xt=150,St={__name:"ParticleMorph",setup(C){const ee=["#services","#work","#building"],X=fe(null),k=fe(null),U=Ge();async function j(e,o){const n=await nt(e),{positions:i}=we(n,4);return{points:ye(i,o,4/n.height),aspect:n.width/n.height}}let c=[],x=[],f=ve(),S=null,P="",E=6,I=1,_=1,b=3,B=0,v=R.scrollY;const D=()=>{f=ve(),S=document.querySelector(".name-zone"),x=c.map(e=>e.el?e.el.getBoundingClientRect().top+window.scrollY:0);for(const e of c){const o=e.el?.querySelector(".form-slot")?.getBoundingClientRect();e.slot=o?.width?{x:o.left+o.width/2,y:o.top+o.height/2+window.scrollY,size:Math.min(o.width,o.height)}:null}};let F=0,V=0;function K(e,o){const t=(e-o/2)/o;let n=-1/0;for(let i=1;i<c.length;i++){if(c[i].name==="name")return[i-1,i,F];if(c[i].name==="line"){if(t<H[1])return[i-1,i,oe.clamp((t-H[0])/(H[1]-H[0]),0,1)];continue}let a=x[i]-o*.55,s=o*.7;if(c[i-1].name==="line"&&(a=Math.max(a,o*(H[1]+gt+.5)),s=o*yt),a=Math.max(a,n),n=a+s,e<a+s)return[i-1,i,Math.min(Math.max((e-a)/s,0),1)]}return[c.length-2,c.length-1,1]}function O(e,o){const{alpha:t,layout:n}=ae[e];return o.width<1024&&!["portrait","name","line"].includes(n)?0:t}let T=1;function $(e,o){const{width:t,height:n}=o,i=ae[e.name],a=i.scale??1;if(e.slot){const s=e.name==="medal"?T:1;return[e.slot.x,e.slot.y-R.scrollY,e.slot.size*(i.slotScale??1)*s,1]}switch(i.layout){case"portrait":{const s=ce();return[s.cx,s.cy,s.height,0]}case"side":{const[s,r]=t>=1024?i.pos??[.72,.5]:[.5,.5];return[t*s,n*r,Math.min(n*.62,t*.85)*a,1]}case"center":return[t/2,n/2,Math.min(n*.75,t*.9)*a,1];case"full":return[t/2,n/2,n,1];case"line":{if(!L)return[t/2,n*.85,J,1];const s=L.getBoundingClientRect(),r=Math.max(0,Math.floor(-s.left/te));return[s.left+r*te+re/2,s.top+J/2,J,1]}case"name":{const s=S?.querySelector(".name-word");if(!s)return[t/2,n*.8,t*.9/E,1];const r=s.getBoundingClientRect(),d=S.getBoundingClientRect();return[r.left+r.width/2,d.top+d.height*.56,r.width/.98/E,1]}}}const A=window.matchMedia("(hover: hover)").matches,H=[.02,.58];let L=null,te=1,re=1,J=1;function be(){L=document.querySelector(".hero .marquee");const e=L?[...L.querySelectorAll(":scope > span > span")].slice(0,3):[];if(e.length<3)return null;const o=L.getBoundingClientRect(),t=e.map(u=>u.getBoundingClientRect());te=t[1].left-t[0].left;const n=getComputedStyle(e[0]),i=Math.max(3,Math.round(parseFloat(n.fontSize)/34)),a=document.createElement("canvas");a.width=Math.ceil(t[2].right-o.left),a.height=Math.ceil(t[0].height),re=a.width,J=a.height;const s=a.getContext("2d",{willReadFrequently:!0});s.font=`${n.fontStyle} ${n.fontWeight} ${n.fontSize} ${n.fontFamily}`,s.fillStyle="#fff";for(const[u,p]of e.entries()){const h=s.measureText(p.textContent),l=(t[u].height-(h.fontBoundingBoxAscent+h.fontBoundingBoxDescent))/2+h.fontBoundingBoxAscent;s.fillText(p.textContent,t[u].left-o.left,l)}const{data:r}=s.getImageData(0,0,a.width,a.height),d=[];for(let u=0;u<a.height;u+=i)for(let p=0;p<a.width;p+=i)r[(u*a.width+p)*4+3]>128&&d.push((p-a.width/2)/a.height,(a.height/2-u)/a.height,0);return{points:new Float32Array(d),jitter:i/a.height}}function Fe(e,o){const t=be();if(!t)return null;const n=t.points,i=n.length/3,a=[...Array(i).keys()].sort(()=>Math.random()-.5),s=new Float32Array(i*3);a.forEach((l,M)=>s.set(n.subarray(l*3,l*3+3),M*3));const r=ye(s,o,t.jitter),d=(l,M)=>l[M*3],u=[...Array(o).keys()].sort((l,M)=>d(r,l)-d(r,M)),p=[...Array(o).keys()].sort((l,M)=>d(e,l)-d(e,M)),h=new Float32Array(o*3);for(let l=0;l<o;l++)h.set(r.subarray(u[l]*3,u[l]*3+3),p[l]*3);return h}const w={x:-9999,y:-9999,inside:!1},m={x:0,y:0,r:0,until:0},se=e=>{e.pointerType==="mouse"&&(w.x=e.clientX,w.y=e.clientY,w.inside=!0)},ie=()=>w.inside=!1,le=e=>{e.pointerType!=="mouse"&&(w.x=e.clientX,w.y=e.clientY,m.until=performance.now()+3e3)};function ce(){const e=ge(f,_),o=e*_,t=f.x+(f.width-o)*f.alignX+o/2,n=f.y+(f.height-e)*f.alignY+e/2-R.scrollY;return{left:t-o/2,top:n-e/2,width:o,height:e,cx:t,cy:n}}const ue=ot();return ht(X,{maxPixelRatio:ue==="high"?2:1.5,async setup({scene:e}){const o=await Ze();b={high:6,mid:8,low:10}[ue],I=o.height,_=o.width/o.height;const t=we(o,b),n=t.count;Qe.dots=n,c=[{name:"portrait",points:t.positions,el:null}];const i=Fe(t.positions,n);i?c.push({name:"line",points:i,el:null}):L&&(L.style.opacity="1");for(const[d,u]of st){if(at&&ee.includes(d))continue;const p=document.querySelector(d);if(!p)continue;await new Promise(l=>setTimeout(l));let h;if(u==="quotes")h=(await j("“ ”",n)).points;else if(u==="name"){const l=await j("Bhavy Gajjar",n);h=l.points,E=l.aspect}else h=new Float32Array(n*3),it[u](n,h);c.push({name:u,points:h,el:p})}D();const a=new Ie;a.setAttribute("position",new W(new Float32Array(n*3),3)),a.setAttribute("aFrom",new W(new Float32Array(n*3),3)),a.setAttribute("aTo",new W(new Float32Array(n*3),3)),a.setAttribute("aLum",new W(t.lums,1)),a.setAttribute("aSeed",new W(et(n),3));const s=new Ve({vertexShader:dt,fragmentShader:tt,transparent:!0,depthWrite:!1,uniforms:{uFrom:{value:new pe},uTo:{value:new pe},uFromRot:{value:new N},uToRot:{value:new N},uFromAlpha:{value:1},uToAlpha:{value:1},uMix:{value:0},uTime:{value:0},uProgress:{value:0},uSpacing:{value:1},uDot:{value:1},uViewport:{value:new N(1,1)},uMouse:{value:new N(-999,-999)},uHover:{value:0},uLens:{value:new me},uLensMax:{value:1},uLensDot:{value:1},uReveal:{value:new me(-9999,-9999,0)},uSwirl:{value:.18},uMist:{value:0},uColor:{value:new G},uAccent:{value:new G(Ee)}}}),r=new Oe(a,s);return r.frustumCulled=!1,e.add(r),s.userData.geometry=a,document.documentElement.classList.add("has-particles"),s},update(e,{time:o,viewport:t,mouse:n,hover:i,color:a,pixelRatio:s}){const r=e.uniforms,d=e.userData.geometry;if(B++%30===0&&D(),S){const y=S.getBoundingClientRect(),Y=y.top<t.height-y.height*.5,q=Math.min(.1,o-V);F=oe.clamp(F+(Y?q/Me:-q*2/Me),0,1)}V=o;const u=R.scrollY-v,p=t.height*ft;v+=Math.max(-p,Math.min(p,u*pt)),(Math.abs(u)<.5||Math.abs(u)>t.height*vt)&&(v=R.scrollY);const[h,l,M]=K(v+t.height/2,t.height);P!==`${h}-${l}`&&(P=`${h}-${l}`,d.attributes.aFrom.array.set(c[h].points),d.attributes.aTo.array.set(c[l].points),d.attributes.aFrom.needsUpdate=!0,d.attributes.aTo.needsUpdate=!0),T+=((rt.hovered?wt:1)-T)*.14;const Te=(1-n.y*2)*.08,ze=(n.x*2-1)*.15,he=y=>{const Y=ae[y.name],q=Y.follow??1;return[(Y.tilt??0)+Te*q,o*(Y.spin??0)+ze*q]};r.uFrom.value.set(...$(c[h],t)),r.uTo.value.set(...$(c[l],t)),r.uFromRot.value.set(...he(c[h])),r.uToRot.value.set(...he(c[l]));const de=c[l].name==="name"?oe.smoothstep(M,.82,1):0;S&&S.style.setProperty("--arrived",de.toFixed(3)),r.uFromAlpha.value=O(c[h].name,t),r.uToAlpha.value=O(c[l].name,t)*(1-de),r.uMix.value=M,r.uSwirl.value=c[l].name==="name"?.1:{portrait:.1,line:.07}[c[h].name]??.18,r.uMist.value=c[l].name==="name"?1:0,r.uTime.value=o,r.uProgress.value=U.progress(o),r.uSpacing.value=ge(f,_)/I*b*s,r.uDot.value=1.7*s,r.uViewport.value.set(t.width,t.height),r.uMouse.value.set(n.x*t.width,(1-n.y)*t.height),r.uHover.value=i,r.uLens.value.set(Z.x,Z.y,A?Z.r:0),r.uLensMax.value=Z.max,r.uLensDot.value=3.2*s,r.uColor.value.copy(a);const g=ce(),Re=h===0&&M<.05&&R.scrollY<4,Ce=performance.now()<m.until,Pe=(A?w.inside:Ce)&&w.x>g.left&&w.x<g.left+g.width&&w.y>g.top&&w.y<g.top+g.height,_e=Re&&Pe?xt:0;if(m.r+=(_e-m.r)*.12,m.x+=(w.x-m.x)*(m.r<1?1:.25),m.y+=(w.y-m.y)*(m.r<1?1:.25),r.uReveal.value.set(m.x,m.y,m.r),k.value){const y=k.value.style;y.transform=`translate3d(${g.left}px, ${g.top}px, 0)`,y.width=`${g.width}px`,y.height=`${g.height}px`,y.setProperty("--mx",`${(m.x-g.left).toFixed(1)}px`),y.setProperty("--my",`${(m.y-g.top).toFixed(1)}px`),y.setProperty("--r",`${m.r.toFixed(1)}px`),y.opacity=m.r>1?"1":"0"}}}),Ae(()=>{window.addEventListener("pointermove",se,{passive:!0}),window.addEventListener("pointerdown",le,{passive:!0}),document.documentElement.addEventListener("pointerleave",ie)}),Le(()=>{U.dispose(),window.removeEventListener("pointermove",se),window.removeEventListener("pointerdown",le),document.documentElement.removeEventListener("pointerleave",ie),L&&(L.style.opacity=""),document.documentElement.classList.remove("has-particles")}),(e,o)=>(Ue(),Xe(Je,null,[ne("canvas",{ref_key:"canvasEl",ref:X,class:"fx-background","aria-hidden":"true"},null,512),ne("div",{ref_key:"revealEl",ref:k,class:"hero-reveal","aria-hidden":"true"},[ne("img",{src:je(Ke),alt:""},null,8,mt)],512)],64))}},bt=Ne(St,[["__scopeId","data-v-8884d602"]]);export{bt as default};
