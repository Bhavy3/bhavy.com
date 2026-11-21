const fs = require('fs');
const target = 'index.html';
fs.copyFileSync(target, '.freebuff/index.html.before-shared-award-hide');
let html = fs.readFileSync(target, 'utf8');
const marker = '</head>';
if (!html.includes(marker)) throw new Error('Head end marker not found');
if (!html.includes('aside.award{display:none!important}')) {
  html = html.replace(marker, '<style>aside.award{display:none!important}</style>\n  </head>');
}
fs.writeFileSync(target, html);
console.log('Applied the no-award-data rule to both app experiences.');
