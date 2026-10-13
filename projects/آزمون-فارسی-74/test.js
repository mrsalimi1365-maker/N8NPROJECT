const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert.ok(html.includes('سلام دنیا'), 'متن «سلام دنیا» باید در index.html وجود داشته باشد');

console.log('آزمون با موفقیت انجام شد.');
