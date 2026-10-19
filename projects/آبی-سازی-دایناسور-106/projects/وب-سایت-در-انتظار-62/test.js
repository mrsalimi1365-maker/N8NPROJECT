const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

assert.match(html, /آزمون فرم فارسی/, 'متن اصلی فارسی باید در HTML وجود داشته باشد');
assert.match(html, /معرفی شخصی یا رزومه/, 'موضوع صفحه باید در HTML وجود داشته باشد');
assert.match(html, /<html[^>]*lang="fa"[^>]*dir="rtl"/, 'صفحه باید فارسی و راست‌به‌چپ باشد');
assert.match(html, /viewport/, 'صفحه باید برای نمایش واکنش‌گرا تنظیم شده باشد');

console.log('تمام آزمون‌ها با موفقیت انجام شدند.');
