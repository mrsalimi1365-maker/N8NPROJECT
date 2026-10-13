(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.factorialUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function isValidInput(value) {
    return typeof value === 'string' && /^\d+$/.test(value.trim());
  }

  function factorial(value) {
    if (!isValidInput(value)) {
      throw new TypeError('ورودی باید یک عدد صحیح نامنفی باشد.');
    }

    const number = BigInt(value.trim());
    let result = 1n;

    for (let i = 2n; i <= number; i++) {
      result *= i;
    }

    return result;
  }

  return { isValidInput, factorial };
});
