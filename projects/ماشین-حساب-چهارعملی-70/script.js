(function (root) {
  'use strict';

  function calculate(first, second, operator) {
    const a = Number(first);
    const b = Number(second);
    if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('عدد نامعتبر است');

    let result;
    if (operator === '+') result = a + b;
    else if (operator === '-') result = a - b;
    else if (operator === '*') result = a * b;
    else if (operator === '/') {
      if (b === 0) throw new Error('تقسیم بر صفر ممکن نیست');
      result = a / b;
    } else {
      throw new Error('عملگر نامعتبر است');
    }

    return Number(result.toPrecision(12));
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return 'خطا';
    const rounded = Number(value.toPrecision(12));
    return String(rounded);
  }

  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined') module.exports = { calculate, formatNumber };
    return;
  }

  const display = document.getElementById('display');
  const expression = document.getElementById('expression');
  let current = '0';
  let previous = null;
  let operator = null;
  let justEvaluated = false;

  function toPersianDigits(text) {
    return String(text).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
  }

  function render() {
    display.textContent = toPersianDigits(current);
    expression.textContent = previous !== null && operator ?
      `${toPersianDigits(previous)} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator}` : '';
  }

  function clear() {
    current = '0'; previous = null; operator = null; justEvaluated = false; render();
  }

  function inputDigit(value) {
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (value === '.' && current.includes('.')) return;
    if (current === '0' && value !== '.') current = value;
    else if (current === '-0') current = '-' + value;
    else current += value;
    render();
  }

  function chooseOperator(nextOperator) {
    if (current === 'خطا') return;
    if (operator && previous !== null && !justEvaluated) {
      try { current = formatNumber(calculate(previous, current, operator)); }
      catch (error) { current = 'خطا'; previous = null; operator = null; render(); return; }
    }
    previous = current;
    operator = nextOperator;
    justEvaluated = false;
    render();
  }

  function equals() {
    if (!operator || previous === null) return;
    try {
      const result = formatNumber(calculate(previous, current, operator));
      expression.textContent = `${toPersianDigits(previous)} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${toPersianDigits(current)} =`;
      current = result;
      previous = null;
      operator = null;
      justEvaluated = true;
      display.textContent = toPersianDigits(current);
    } catch (error) {
      current = 'خطا'; previous = null; operator = null; justEvaluated = true;
      expression.textContent = error.message;
      display.textContent = current;
    }
  }

  function backspace() {
    if (justEvaluated || current === 'خطا') return clear();
    current = current.length > 1 ? current.slice(0, -1) : '0';
    if (current === '-') current = '0';
    render();
  }

  document.querySelector('.keypad').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.value !== undefined) {
      const value = button.dataset.value;
      if ('+-*/'.includes(value)) chooseOperator(value); else inputDigit(value);
    } else if (button.dataset.action === 'clear') clear();
    else if (button.dataset.action === 'backspace') backspace();
    else if (button.dataset.action === 'equals') equals();
  });

  document.addEventListener('keydown', event => {
    const key = event.key;
    if (/^[0-9.]$/.test(key)) inputDigit(key);
    else if ('+-*/'.includes(key)) chooseOperator(key);
    else if (key === 'Enter' || key === '=') equals();
    else if (key === 'Backspace') backspace();
    else if (key === 'Escape' || key.toLowerCase() === 'c') clear();
    else return;
    event.preventDefault();
  });

  render();
  root.Calculator = { calculate, formatNumber };
})(typeof window !== 'undefined' ? window : globalThis);
