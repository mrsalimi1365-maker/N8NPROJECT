const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

assert.strictEqual(pkg.scripts.test, 'node test.js', 'اسکریپت آزمون باید آفلاین و با Node اجرا شود');
assert.ok(html.includes('<html lang="fa" dir="rtl">'), 'صفحه باید فارسی و راست‌به‌چپ باشد');
assert.ok(html.includes('<title>آزمون پیگیری فرم</title>'), 'عنوان صفحه باید عنوان آزمون پیگیری فرم باشد');
assert.ok(html.includes('کتاب‌خانه'), 'نام کتاب‌فروشی باید در صفحه وجود داشته باشد');
assert.ok(html.includes('id="contact-form"'), 'فرم تماس باید وجود داشته باشد');
assert.ok(html.includes('id="form-status"'), 'ناحیه اعلام وضعیت فرم باید وجود داشته باشد');
assert.ok(html.includes("event.preventDefault()"), 'فرم نباید باعث بارگذاری مجدد صفحه شود');
assert.ok(html.includes('type="submit"'), 'فرم باید دکمه ارسال داشته باشد');
assert.ok(html.includes('id="books"') && html.includes('id="about"'), 'بخش‌های معرفی و پیشنهاد کتاب باید وجود داشته باشند');
assert.ok(!html.includes('https://') && !html.includes('http://'), 'پروژه نباید وابستگی شبکه‌ای داشته باشد');

console.log('همه آزمون‌ها با موفقیت گذرانده شدند.');
