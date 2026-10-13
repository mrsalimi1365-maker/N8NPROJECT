'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateFactorial, calculateCosine } = require('../calculator.js');

test('فاکتوریل صفر برابر یک است', () => {
  assert.equal(calculateFactorial(0), 1);
});

test('فاکتوریل عدد پنج محاسبه می‌شود', () => {
  assert.equal(calculateFactorial(5), 120);
});

test('فاکتوریل ورودی نامعتبر را رد می‌کند', () => {
  assert.throws(() => calculateFactorial(-1));
  assert.throws(() => calculateFactorial(2.5));
});

test('کسینوس صفر درجه برابر یک است', () => {
  assert.ok(Math.abs(calculateCosine(0) - 1) < 1e-12);
});

test('کسینوس ۱۸۰ درجه برابر منفی یک است', () => {
  assert.ok(Math.abs(calculateCosine(180) + 1) < 1e-12);
});

test('کسینوس ۶۰ درجه برابر نیم است', () => {
  assert.ok(Math.abs(calculateCosine(60) - 0.5) < 1e-12);
});

test('کسینوس ورودی نامعتبر را رد می‌کند', () => {
  assert.throws(() => calculateCosine('زاویه'));
});
