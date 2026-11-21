// One-off patcher for the prebuilt bundles: wires the location/time card and the
// assistant to the static-hosting fallbacks defined in index.html. Run once with
// `node .freebuff/patch-visitor-geo.cjs`; it fails loudly if a snippet is missing.
const { readFileSync, writeFileSync } = require('node:fs')

const patches = {
  'assets/index-CoQKB6gy.js': [
    // "behind" wording for visitors west of UTC
    [
      '"here.ahead":"About {n} hours ahead of UTC","here.ahead1":"About 1 hour ahead of UTC"}',
      '"here.ahead":"About {n} hours ahead of UTC","here.ahead1":"About 1 hour ahead of UTC","here.behind":"About {n} hours behind UTC","here.behind1":"About 1 hour behind UTC"}',
    ],
    // /api/geo -> shared lookup that also works on GitHub Pages
    [
      'const f=new AbortController,p=setTimeout(()=>f.abort(),2e3),m=await fetch("/api/geo",{signal:f.signal});return clearTimeout(p),m.headers.get("content-type")?.includes("json")?(await m.json()).country??null:null',
      'const j=window.__geo?await window.__geo():null;return j&&j.country?j.country:null',
    ],
    // Only English ships in this copy and the prompt copy was emptied, so the
    // country-based language prompt has nothing to show: never open it.
    ['async function a(){if(qi())return;', 'async function a(){return;if(qi())return;'],
  ],
  'assets/SiteView-DWZhIdWn.js': [
    // HomeGlobe: keep Bhavy's point, aim the arc at the visitor and remember
    // their country name/time zone.
    [
      'a=S(null),i=S(null),r=Ln(),d=Ie(()=>l[Lt.value]??l.en);function w(_,',
      'a=S(null),i=S(null),_gp=S(null),_gc=S(null),r=Ln(()=>_gp.value&&_gp.value.zone),d=Ie(()=>_gp.value??l[Lt.value]??l.en);window.__geo&&window.__geo().then(_=>{if(!_)return;_gc.value=_.name||_.country||null;typeof _.lat=="number"&&typeof _.lon=="number"&&(_gp.value={lat:_.lat,lon:_.lon,zone:_.zone||"UTC"})});function w(_,',
    ],
    // Exact zone offset: without seconds the difference is 329-330 minutes for
    // half-hour zones, which rounded to 5 sometimes and 6 other times.
    [
      '{timeZone:_,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric"}',
      '{timeZone:_,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}',
    ],
    [
      'return Math.round((Date.UTC(k.year,k.month-1,k.day,k.hour,k.minute)-L.getTime())/6e4)',
      'return Math.round((Date.UTC(k.year,k.month-1,k.day,k.hour,k.minute,k.second||0)-L.getTime())/6e4)',
    ],
    // offset of the shown place from UTC, with "ahead"/"behind" wording
    [
      'const y=Ie(()=>{const _=Math.round((w(c.zone)-w(d.value.zone))/60);return _===0?xe("here.same"):xe(_===1?"here.ahead1":"here.ahead",{n:_})})',
      'const y=Ie(()=>{const _=Math.round(w(_gp.value&&_gp.value.zone||c.zone)/60),A=Math.abs(_);return _===0?xe("here.same"):_>0?xe(A===1?"here.ahead1":"here.ahead",{n:A}):xe(A===1?"here.behind1":"here.behind",{n:A})})',
    ],
    // country label
    ['R(t(_.$t("here.city"))+" ",1)', 'R(t(_gc.value||_.$t("here.city"))+" ",1)'],
    // clock: the visitor's zone when known, Bhavy's otherwise
    [
      'function Ln(){const z=S("");let s=null;const c=()=>{z.value=new Date().toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:!1})};',
      'function Ln(V){const z=S("");let s=null;const c=()=>{z.value=new Date().toLocaleTimeString("en-GB",{timeZone:V&&V()||"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:!1})};',
    ],
    // assistant: on a static host don't POST to a route that can't exist, just
    // fall through to the in-browser answer
    [
      'try{const D=await(await fetch("/api/chat",{method:"POST",',
      'try{if(!/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname))throw 0;const D=await(await fetch("/api/chat",{method:"POST",',
    ],
    // and only log when there is no answer either
    [
      '}catch(u){console.error("[chat]",u),i.value.push({id:++r,role:"assistant",content:xe("chat.networkError")})}',
      '}catch(u){const Z=window.__chatFallback&&window.__chatFallback(i.value);Z||console.error("[chat]",u),i.value.push({id:++r,role:"assistant",content:Z||xe("chat.networkError")})}',
    ],
  ],
}

let failed = false
for (const [file, pairs] of Object.entries(patches)) {
  let source = readFileSync(file, 'utf8')
  for (const [from, to] of pairs) {
    if (!source.includes(from)) {
      console.error(`MISSING in ${file}: ${from.slice(0, 90)}`)
      failed = true
      continue
    }
    source = source.split(from).join(to)
  }
  if (!failed) writeFileSync(file, source)
}
if (failed) process.exit(1)
console.log('patched', Object.keys(patches).join(', '))
