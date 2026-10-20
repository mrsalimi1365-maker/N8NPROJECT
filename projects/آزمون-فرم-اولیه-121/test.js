const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert.match(html, /<html[^>]*lang=["']fa["'][^>]*dir=["']rtl["']/i, 'صفحه باید فارسی و راست‌به‌چپ باشد');
assert.match(html, /<h1[^>]*>\s*آزمون فرم اولیه\s*<\/h1>/, 'تیتر موردنیاز باید وجود داشته باشد');
assert.match(html, /<button[^>]*>\s*شروع\s*<\/button>/, 'دکمهٔ نمایشی با متن شروع باید وجود داشته باشد');
assert.doesNotMatch(html, /<script\b/i, 'صفحه نباید اسکریپت داشته باشد');
assert.doesNotMatch(html, /https?:\/\//i, 'صفحه نباید به شبکه یا منبع خارجی وابسته باشد');

console.log('همهٔ آزمون‌ها با موفقیت انجام شد.');
