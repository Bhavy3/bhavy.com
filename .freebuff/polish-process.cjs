const fs = require('fs');
const target = 'assets/index-CoQKB6gy.js';
fs.copyFileSync(target, '.freebuff/index-CoQKB6gy.js.process-v2');
let code = fs.readFileSync(target, 'utf8');
const replacements = new Map([
  ['Prepare and explore the data before choosing an approach.', 'Collect, clean, and explore the available data.'],
  ['Build models against a clear baseline.', 'Train and compare models against a clear baseline.'],
  ['Explain results and turn useful models into tools.', 'Use SHAP and LIME to make model behavior easier to understand.'],
  ['Launch only what the evidence supports.', 'Release only what the evidence supports.']
]);
for (const [from, to] of replacements) {
  const count = code.split(from).length - 1;
  if (count !== 1) throw new Error(`Expected one copy of: ${from}; found ${count}`);
  code = code.replace(from, to);
}
fs.writeFileSync(target, code);
console.log('Polished repeated process descriptions.');
