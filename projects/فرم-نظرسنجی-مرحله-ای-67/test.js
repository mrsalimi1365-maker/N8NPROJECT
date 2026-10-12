const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

assert.match(html, /id="identityForm"/);
assert.match(html, /id="firstName"[^>]*required/);
assert.match(html, /id="lastName"[^>]*required/);
assert.match(html, /id="surveyForm" hidden/);
assert.match(html, /id="identityForm"[\s\S]*id="surveyForm"/);
assert.equal((html.match(/name="q[1-5]"/g) || []).length, 10);
for (let i = 1; i <= 5; i += 1) {
  assert.match(html, new RegExp(`name="q${i}"[^>]*value="بله"`));
  assert.match(html, new RegExp(`name="q${i}"[^>]*value="خیر"`));
}
assert.match(html, /نام و نام خانوادگی/);
assert.match(html, /event\.preventDefault\(\)/);
assert.match(html, /لطفاً هر دو فیلد نام و نام خانوادگی را کامل کنید/);
assert.match(html, /لطفاً به هر پنج پرسش پاسخ دهید/);
console.log('همه تست‌های ساختار و اعتبارسنجی با موفقیت انجام شدند.');
