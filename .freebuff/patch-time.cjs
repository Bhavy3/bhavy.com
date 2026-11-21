const fs = require('fs');
const site = 'assets/SiteView-DWZhIdWn.js';
const app = 'assets/index-CoQKB6gy.js';
fs.copyFileSync(site, '.freebuff/SiteView-DWZhIdWn.js.before-time-fix');
fs.copyFileSync(app, '.freebuff/index-CoQKB6gy.js.before-time-fix');
let code = fs.readFileSync(site, 'utf8');
const replacements = new Map([
  ['lat:-33.92,lon:18.42,zone:"Africa/Johannesburg"', 'lat:22.97,lon:78.65,zone:"Asia/Kolkata"'],
  ['toLocaleTimeString("en-ZA",{timeZone:"Africa/Johannesburg"', 'toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata"'],
  ['timeZone:"Africa/Johannesburg"', 'timeZone:"Asia/Kolkata"'],
  ['+" SAST"', '+" IST"']
]);
for (const [from, to] of replacements) {
  if (!code.includes(from)) throw new Error(`Missing time/location anchor: ${from}`);
  code = code.replace(from, to);
}
// Ensure the repeated timezone was replaced everywhere, including the footer clock.
if (code.includes('Africa/Johannesburg') || code.includes(' SAST')) throw new Error('A South Africa clock reference remains');
fs.writeFileSync(site, code);
let appCode = fs.readFileSync(app, 'utf8');
const start = appCode.indexOf('const Hs={');
const end = appCode.indexOf('},$a={}', start);
if (start < 0 || end < 0) throw new Error('Translation map boundary not found');
const more = '"here.ahead":"About {n} hours ahead of UTC","here.ahead1":"About 1 hour ahead of UTC"';
appCode = appCode.slice(0, end) + ',' + more + appCode.slice(end);
fs.writeFileSync(app, appCode);
console.log('Aligned the site clock and location with India and IST.');
