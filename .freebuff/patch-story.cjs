const fs = require('fs');
const app = 'assets/index-CoQKB6gy.js';
const story = 'assets/StoryView-B6USSkpD.js';
fs.copyFileSync(app, '.freebuff/index-CoQKB6gy.js.locale-v1');
fs.copyFileSync(story, '.freebuff/StoryView-B6USSkpD.js.original');
let code = fs.readFileSync(app, 'utf8');
const start = code.indexOf('const Hs={');
const end = code.indexOf('},$a={}', start);
if (start < 0 || end < 0) throw new Error('Translation map boundary not found');
const additions = {
  'dock.soundOn': 'Sound on',
  'dock.soundOff': 'Sound off',
  'dock.track': 'Change soundtrack',
  'story.brand': 'a story in particles',
  'story.chapters': 'Story chapters',
  'story.chapter': 'Go to chapter {n}: {title}',
  'story.cta': 'Start a conversation',
  'story.explore': 'Explore the standard site',
  'story.localTime': 'Local time',
  'story.ring.visit': 'Visit link',
  'story.ring.drag': 'Drag to explore',
  'story.ring.reveal': 'View details',
  'story.scroll': 'Scroll to continue',
  'story.awards': 'Find me online',
  'story.clickVisit': 'Open link',
  'story.tapVisit': 'Tap to open',
  'story.hover.globe': 'Move your pointer to explore the particles.',
  'story.title.roles': 'A few people believed in me.'
};
const serialized = Object.entries(additions).map(([k,v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',');
code = code.slice(0, end) + ',' + serialized + code.slice(end);
fs.writeFileSync(app, code);
let storyCode = fs.readFileSync(story, 'utf8');
const old = 'r.id==="portal"?(C(),I("p",xa';
const replacement = 'r.id==="portal"&&G(Po)&&G(_o)?(C(),I("p",xa';
if (!storyCode.includes(old)) throw new Error('Empty social-link row anchor not found');
storyCode = storyCode.replace(old, replacement);
fs.writeFileSync(story, storyCode);
console.log(`Added ${Object.keys(additions).length} story/control labels and suppressed the empty social row.`);
