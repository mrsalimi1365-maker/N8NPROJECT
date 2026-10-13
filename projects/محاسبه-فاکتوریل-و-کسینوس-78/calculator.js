'use strict';

function calculateFactorial(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number) || number < 0) {
    throw new Error('فاکتوریل فقط برای عدد صحیح نامنفی تعریف شده است.');
  }
  if (number > 170) {
    throw new Error('عدد واردشده برای نمایش فاکتوریل بسیار بزرگ است.');
  }

  let result = 1;
  for (let index = 2; index <= number; index += 1) {
    result *= index;
  }
  return result;
}

function calculateCosine(degrees) {
  const angle = Number(degrees);
  if (!Number.isFinite(angle)) {
    throw new Error('لطفاً یک زاویهٔ معتبر برحسب درجه وارد کنید.');
  }
  return Math.cos((angle * Math.PI) / 180);
}

module.exports = { calculateFactorial, calculateCosine };
