const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.strictEqual(packageFile.scripts.test, 'node test.js', 'فرمان تست باید بدون وابستگی خارجی باشد');
assert.match(html, /<html[^>]+lang="fa"[^>]+dir="rtl"/, 'صفحه باید فارسی و راست‌به‌چپ باشد');
assert.match(html, /<title>نقاشی ساده<\/title>/, 'عنوان صفحه وجود ندارد');
assert.match(html, /id="drawingCanvas"/, 'بوم نقاشی وجود ندارد');
assert.match(html, /id="colorPicker"[^>]+type="color"/, 'کنترل انتخاب رنگ وجود ندارد');
assert.match(html, /id="brushSize"[^>]+type="range"/, 'کنترل اندازه قلم وجود ندارد');
assert.match(html, /id="saveButton"/, 'دکمه ذخیره وجود ندارد');
assert.match(html, /id="undoButton"/, 'دکمه بازگشت وجود ندارد');
assert.match(html, /id="clearButton"/, 'دکمه پاک‌سازی وجود ندارد');
assert.match(js, /pointerdown/, 'پشتیبانی از شروع رسم وجود ندارد');
assert.match(js, /pointermove/, 'پشتیبانی از حرکت pointer وجود ندارد');
assert.match(js, /destination-out/, 'پاک‌کن پیاده‌سازی نشده است');
assert.match(js, /toDataURL\(['"]image\/png['"]\)/, 'خروجی PNG پیاده‌سازی نشده است');
assert.match(css, /touch-action:\s*none/, 'جلوگیری از اسکرول هنگام لمس وجود ندارد');

console.log('همه آزمون‌ها با موفقیت گذرانده شدند.');
