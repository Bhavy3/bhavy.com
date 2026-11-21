const fs = require('fs');
const target = 'assets/index-CoQKB6gy.js';
fs.copyFileSync(target, '.freebuff/index-CoQKB6gy.js.process-v1');
let code = fs.readFileSync(target, 'utf8');
const replacements = new Map([
  ['title:"Design",desc:', 'title:"Prepare",desc:'],
  ['title:"Architect",desc:', 'title:"Model",desc:'],
  ['title:"Build",desc:', 'title:"Explain",desc:'],
  ['title:"Support",desc:', 'title:"Improve",desc:']
]);
for (const [from, to] of replacements) {
  if (!code.includes(from)) throw new Error(`Missing process title: ${from}`);
  code = code.replace(from, to);
}
fs.writeFileSync(target, code);
console.log('Aligned all process step titles with their descriptions.');
