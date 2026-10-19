const test = require('node:test');
const assert = require('node:assert/strict');
const { products, formatPrice, filterProducts, validateLogin } = require('../app.js');

test('داده‌های نمونه محصولات کافی هستند', () => {
  assert.equal(products.length, 8);
  assert.ok(products.every((product) => product.name && product.price > 0));
});

test('فیلتر محصولات بر اساس جست‌وجو و دسته‌بندی کار می‌کند', () => {
  assert.equal(filterProducts(products, 'ماگ').length, 1);
  assert.ok(filterProducts(products, '', 'دیجیتال').every((product) => product.category === 'دیجیتال'));
  assert.equal(filterProducts(products, 'چیزی که وجود ندارد').length, 0);
});

test('قیمت با واحد تومان قالب‌بندی می‌شود', () => {
  assert.match(formatPrice(385000), /تومان$/);
  assert.match(formatPrice(385000), /۳۸۵/);
});

test('اعتبارسنجی ورود خطاهای پایه را تشخیص می‌دهد', () => {
  assert.notEqual(validateLogin('wrong', '123456'), '');
  assert.notEqual(validateLogin('user@example.com', '123'), '');
  assert.equal(validateLogin('user@example.com', '123456'), '');
});
