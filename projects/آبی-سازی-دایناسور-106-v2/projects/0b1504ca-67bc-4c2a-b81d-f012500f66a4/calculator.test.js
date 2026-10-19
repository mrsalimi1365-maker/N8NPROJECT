import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExpression, formatResult } from './script.js';

test('جمع', () => assert.equal(calculateExpression('12+8'), 20));
test('تفریق', () => assert.equal(calculateExpression('12-8'), 4));
test('ضرب', () => assert.equal(calculateExpression('7*6'), 42));
test('تقسیم', () => assert.equal(calculateExpression('20/5'), 4));
test('اعداد اعشاری', () => assert.equal(calculateExpression('0.1+0.2'), 0.3));
test('رعایت اولویت و زنجیره عملیات', () => assert.equal(calculateExpression('2+3*4-8/2'), 10));
test('عدد منفی', () => assert.equal(calculateExpression('-5+2*-3'), -11));
test('پاک‌سازی نمایش نتیجه', () => assert.equal(formatResult(calculateExpression('9*9')), '81'));
test('تقسیم بر صفر خطا می‌دهد', () => assert.throws(() => calculateExpression('10/0'), /تقسیم بر صفر/));
test('ورودی نامعتبر خطا می‌دهد', () => assert.throws(() => calculateExpression('2++'), /ورودی نامعتبر/));
