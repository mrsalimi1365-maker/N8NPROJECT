const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

assert.ok(html.includes('<html lang="fa" dir="rtl">'), 'صفحه باید فارسی و راست‌به‌چپ باشد.');
assert.ok(html.includes('متن آزمون فرم فارسی'), 'متن آزمون باید در HTML وجود داشته باشد.');
assert.ok(html.includes('<title>'), 'صفحه باید عنوان داشته باشد.');
assert.ok(html.includes('نگار احمدی'), 'نام معرفی‌شده باید در صفحه وجود داشته باشد.');
assert.ok(html.includes('id="about"'), 'بخش درباره من باید وجود داشته باشد.');

console.log('همه آزمون‌ها با موفقیت انجام شدند.');
