const fs = require('fs');
const target = 'assets/SiteView-BPFIe396.css';
fs.copyFileSync(target, '.freebuff/SiteView-BPFIe396.css.before-award-hide');
let styles = fs.readFileSync(target, 'utf8');
styles += '\n/* Do not show award badges when this copy has no award destinations. */\n.award,.award-seal{display:none!important}\n';
fs.writeFileSync(target, styles);
console.log('Suppressed award badges with no configured destinations.');
