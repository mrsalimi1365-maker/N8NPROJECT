const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert.match(html, /<html[^>]*lang="fa"[^>]*dir="rtl"/i);
assert.match(html, /<h1>\s*Salimi review verified\s*<\/h1>/i);
assert.match(html, /<meta[^>]*name="viewport"/i);

console.log('All tests passed.');
