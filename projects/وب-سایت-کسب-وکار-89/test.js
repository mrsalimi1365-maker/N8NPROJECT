const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

assert.match(html, /<html\s+lang="fa"\s+dir="rtl">/);
assert.match(html, /<title>کتاب‌فروشی روشن<\/title>/);
assert.match(html, /<h1[^>]*>کتاب‌فروشی روشن<\/h1>/);
assert.match(html, /روشن، جایی برای پیدا کردن کتاب‌هایی است که نگاه شما را تازه می‌کنند/);
assert.match(html, /<section class="hero"/);
assert.match(html, /<aside class="intro-card"/);
assert.doesNotMatch(html, /https?:\/\//);

console.log('تمام آزمون‌ها با موفقیت گذرانده شدند.');
