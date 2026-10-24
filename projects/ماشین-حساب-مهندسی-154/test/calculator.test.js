const assert = require('node:assert/strict');
const { calculate, trigonometric, formatNumber } = require('../script.js');

assert.equal(calculate(7, '+', 5), 12);
assert.equal(calculate(7, '−', 5), 2);
assert.equal(calculate(7, '×', 5), 35);
assert.equal(calculate(15, '÷', 3), 5);
assert.equal(calculate(0.1, '+', 0.2), 0.30000000000000004);
assert.ok(Math.abs(trigonometric(30, 'sin') - 0.5) < 1e-12);
assert.ok(Math.abs(trigonometric(60, 'cos') - 0.5) < 1e-12);
assert.equal(formatNumber(1 / 3), '0.3333333333');
assert.throws(() => calculate(4, '÷', 0), /تقسیم بر صفر/);
assert.throws(() => calculate('x', '+', 2), /ورودی نامعتبر/);
assert.throws(() => trigonometric('x', 'sin'), /ورودی نامعتبر/);

console.log('تمام آزمون‌های ماشین حساب با موفقیت گذرانده شدند.');
