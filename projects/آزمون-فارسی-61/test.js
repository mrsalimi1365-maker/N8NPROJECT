const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert.ok(html.includes('سلام دنیا'), 'متن «سلام دنیا» باید در index.html وجود داشته باشد');

console.log('تست با موفقیت اجرا شد.');
