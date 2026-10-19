const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

assert.match(html, /<title>REVISION-SMOKE-ORIGINAL<\/title>/);
assert.match(html, /<button[^>]*>\s*شروع تازه\s*<\/button>/);
assert.doesNotMatch(html, /<button[^>]*>\s*شروع\s*<\/button>/);
assert.ok(html.includes('<!-- KEEP-REVISION-MARKER-702 -->'));

console.log('همه آزمون‌ها با موفقیت انجام شدند.');
