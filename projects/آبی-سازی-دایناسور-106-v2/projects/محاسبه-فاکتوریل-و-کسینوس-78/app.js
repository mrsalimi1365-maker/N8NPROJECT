'use strict';

const { calculateFactorial, calculateCosine } = require('./calculator.js');

const factorialForm = document.querySelector('#factorial-form');
const factorialInput = document.querySelector('#factorial-input');
const factorialResult = document.querySelector('#factorial-result');
const cosineForm = document.querySelector('#cosine-form');
const cosineInput = document.querySelector('#cosine-input');
const cosineResult = document.querySelector('#cosine-result');

function showResult(element, message, type) {
  element.textContent = message;
  element.className = `result ${type}`;
}

factorialForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const value = factorialInput.value.trim();
    if (value === '') throw new Error('لطفاً یک عدد برای فاکتوریل وارد کنید.');
    const result = calculateFactorial(value);
    showResult(factorialResult, `نتیجه: ${result.toLocaleString('fa-IR')}`, 'success');
  } catch (error) {
    showResult(factorialResult, error.message, 'error');
  }
});

cosineForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const value = cosineInput.value.trim();
    if (value === '') throw new Error('لطفاً یک زاویه وارد کنید.');
    const result = calculateCosine(value);
    const readableResult = Math.abs(result) < 1e-12 ? 0 : result;
    showResult(cosineResult, `کسینوس ${Number(value).toLocaleString('fa-IR')} درجه: ${readableResult.toFixed(12)}`, 'success');
  } catch (error) {
    showResult(cosineResult, error.message, 'error');
  }
});
