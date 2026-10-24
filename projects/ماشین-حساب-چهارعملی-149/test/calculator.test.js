const test = require('node:test');
const assert = require('node:assert/strict');
const Calculator = require('../calculator.js');

function result(...steps) {
  const calc = new Calculator();
  for (const step of steps) step(calc);
  return calc.getDisplay();
}

const digit = value => calc => calc.inputDigit(String(value));
const op = value => calc => calc.chooseOperator(value);
const equals = calc => calc.calculate();

test('چهار عمل اصلی را انجام می‌دهد', () => {
  assert.equal(result(digit(7), op('+'), digit(5), equals), '12');
  assert.equal(result(digit(9), op('-'), digit(4), equals), '5');
  assert.equal(result(digit(6), op('*'), digit(7), equals), '42');
  assert.equal(result(digit(8), op('/'), digit(2), equals), '4');
});

test('زنجیره محاسباتی را پشتیبانی می‌کند', () => {
  assert.equal(result(digit(2), op('+'), digit(3), op('*'), digit(4), equals), '20');
});

test('اعداد اعشاری و منفی را مدیریت می‌کند', () => {
  assert.equal(result(digit(1), calc => calc.inputDecimal(), digit(5), op('+'), calc => calc.toggleSign(), digit(2), equals), '-0.5');
  assert.equal(result(digit(5), calc => calc.inputDecimal(), digit(5), op('*'), digit(2), equals), '11');
});

test('تقسیم بر صفر خطا می‌دهد و پاک‌سازی کار می‌کند', () => {
  const calc = new Calculator();
  calc.inputDigit('8'); calc.chooseOperator('/'); calc.inputDigit('0'); calc.calculate();
  assert.equal(calc.getDisplay(), 'خطا');
  calc.clear();
  assert.equal(calc.getDisplay(), '0');
});

test('حذف آخرین رقم و اعشار تکراری درست عمل می‌کنند', () => {
  const calc = new Calculator();
  calc.inputDigit('1'); calc.inputDigit('2'); calc.backspace();
  assert.equal(calc.getDisplay(), '1');
  calc.inputDecimal(); calc.inputDecimal();
  assert.equal(calc.getDisplay(), '1.');
});
