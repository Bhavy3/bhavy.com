const fs = require('fs');
const target = 'assets/StoryView-B6USSkpD.js';
fs.copyFileSync(target, '.freebuff/StoryView-B6USSkpD.js.story-labels-v1');
let code = fs.readFileSync(target, 'utf8');
const replacements = new Map([
  ['title:"A few people who believed in me,",body:"and a lot of late nights learning."', 'title:"A few people believed in me.",body:"There were many late nights spent learning."']
]);
for (const [from, to] of replacements) {
  if (!code.includes(from)) throw new Error('Story chapter copy anchor not found');
  code = code.replace(from, to);
}
fs.writeFileSync(target, code);
console.log('Corrected the story chapter punctuation and fragment.');
