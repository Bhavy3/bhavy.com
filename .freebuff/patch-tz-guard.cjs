// Second one-off patcher for the prebuilt bundles: makes the clock and the UTC
// offset computation tolerate a time zone the browser doesn't know, instead of
// throwing a RangeError on every tick. Run with `node .freebuff/patch-tz-guard.cjs`;
// it fails loudly if a snippet is missing. Backup: .freebuff/SiteView-DWZhIdWn.js.before-tz-guard
const { copyFileSync, readFileSync, writeFileSync, existsSync } = require('node:fs')

const file = 'assets/SiteView-DWZhIdWn.js'
const backup = '.freebuff/SiteView-DWZhIdWn.js.before-tz-guard'
if (!existsSync(backup)) copyFileSync(file, backup)

const patches = [
  // Offset helper: one formatter factory that falls back to UTC when Intl rejects
  // the zone, and an offset that can never come back NaN.
  [
    'function w(_,L=new Date){const k=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:_,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(L).map(Y=>[Y.type,Number(Y.value)]));return Math.round((Date.UTC(k.year,k.month-1,k.day,k.hour,k.minute,k.second||0)-L.getTime())/6e4)}',
    'function _zdf(Z){const K={hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"};try{return new Intl.DateTimeFormat("en-GB",{timeZone:Z||"UTC",...K})}catch{return new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",...K})}}' +
      'function w(_,L=new Date){const k=Object.fromEntries(_zdf(_).formatToParts(L).map(Y=>[Y.type,Number(Y.value)])),d=Math.round((Date.UTC(k.year,k.month-1,k.day,k.hour,k.minute,k.second||0)-L.getTime())/6e4);return Number.isFinite(d)?d:0}',
  ],
  // Clock: a bad zone falls back to Bhavy's zone, then to the browser's own, so
  // the ticking label never stops updating.
  [
    'const c=()=>{z.value=new Date().toLocaleTimeString("en-GB",{timeZone:V&&V()||"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:!1})};',
    'const c=()=>{const _z=V&&V()||"Asia/Kolkata",_f=_=>new Date().toLocaleTimeString("en-GB",{timeZone:_,hour:"2-digit",minute:"2-digit",hour12:!1});try{z.value=_f(_z)}catch{try{z.value=_f("Asia/Kolkata")}catch{z.value=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:!1})}}};',
  ],
]

let source = readFileSync(file, 'utf8')
let failed = false
for (const [from, to] of patches) {
  if (!source.includes(from)) {
    console.error(`MISSING in ${file}: ${from.slice(0, 90)}`)
    failed = true
    continue
  }
  source = source.split(from).join(to)
}
if (failed) process.exit(1)
writeFileSync(file, source)
console.log('patched', file)
