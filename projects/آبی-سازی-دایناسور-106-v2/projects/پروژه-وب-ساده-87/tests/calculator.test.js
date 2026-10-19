const assert = require('node:assert/strict');
const Calculator = require('../calculator.js');

function value(calculator) { return calculator.display; }

const calculator = new Calculator();
calculator.inputDigit('1').inputDigit('2').chooseOperation('add').inputDigit('7').equals();
assert.equal(value(calculator), '19', 'جمع باید درست محاسبه شود');

calculator.clear().inputDigit('9').chooseOperation('multiply').inputDigit('6').equals();
assert.equal(value(calculator), '54', 'ضرب باید درست محاسبه شود');

calculator.clear().inputDigit('8').chooseOperation('divide').inputDigit('2').equals();
assert.equal(value(calculator), '4', 'تقسیم باید درست محاسبه شود');

calculator.clear().inputDigit('5').chooseOperation('subtract').inputDigit('8').equals();
assert.equal(value(calculator), '-3', 'تفریق اعداد منفی باید درست باشد');

calculator.clear().inputDigit('1').decimal().inputDigit('5').chooseOperation('multiply').inputDigit('2').equals();
assert.equal(value(calculator), '3', 'اعداد اعشاری باید درست محاسبه شوند');

calculator.clear().inputDigit('5').percent();
assert.equal(value(calculator), '0.05', 'درصد باید به کسر تبدیل شود');

calculator.clear().inputDigit('9').inputDigit('8').backspace();
assert.equal(value(calculator), '9', 'حذف آخرین رقم باید کار کند');

calculator.clear().inputDigit('4').chooseOperation('divide').inputDigit('0').equals();
assert.equal(value(calculator), 'خطا', 'تقسیم بر صفر باید خطا بدهد');

console.log('همه آزمون‌ها با موفقیت انجام شدند.');
