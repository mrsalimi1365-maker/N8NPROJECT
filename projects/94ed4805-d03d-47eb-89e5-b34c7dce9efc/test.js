const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
assert.ok(html.includes('<h1>Salimi deployment verified</h1>'));
