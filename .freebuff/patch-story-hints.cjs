const fs = require('fs');
const target = 'assets/index-CoQKB6gy.js';
fs.copyFileSync(target, '.freebuff/index-CoQKB6gy.js.story-copy-v1');
let code = fs.readFileSync(target, 'utf8');
const start = code.indexOf('const Hs={');
const end = code.indexOf('},$a={}', start);
if (start < 0 || end < 0) throw new Error('Translation map boundary not found');
const additions = {
  'story.hover.nebula': 'Scroll through the chapters to follow the story.',
  'story.hover.storefront': 'Move your pointer to explore where the idea began.',
  'story.hover.systems': 'Move your pointer to explore the machine learning behind the assistant.',
  'story.hover.years': 'Move your pointer to follow the timeline.',
  'story.hover.portal': 'Move your pointer to explore the next step.'
};
const serialized = Object.entries(additions).map(([k,v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',');
code = code.slice(0, end) + ',' + serialized + code.slice(end);
fs.writeFileSync(target, code);
console.log('Added the remaining story interaction hints.');
