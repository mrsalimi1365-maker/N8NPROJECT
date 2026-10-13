const assert = require('node:assert/strict');
const { factorial, isValidInput } = require('./factorial.js');

assert.equal(factorial('0').toString(), '1');
assert.equal(factorial('1').toString(), '1');
assert.equal(factorial('5').toString(), '120');
assert.equal(factorial('10').toString(), '3628800');
assert.equal(factorial('20').toString(), '2432902008176640000');
assert.equal(factorial('0005').toString(), '120');

for (const value of ['', ' ', '-1', '1.5', 'abc', '۱۱', null, 5]) {
  assert.equal(isValidInput(value), false, `ورودی نامعتبر پذیرفته شد: ${value}`);
  assert.throws(() => factorial(value), TypeError);
}

assert.equal(isValidInput('0'), true);
assert.equal(isValidInput('123'), true);

console.log('همهٔ آزمون‌ها با موفقیت اجرا شدند.');
