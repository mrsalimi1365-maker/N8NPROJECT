const test = require('node:test');
const assert = require('node:assert/strict');
const { averages, loadResponses, saveResponse, QUESTIONS, STORAGE_KEY } = require('../app.js');

function storage() {
  const data = new Map();
  return { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}

test('ذخیره و بازیابی پاسخ‌ها انجام می‌شود', () => {
  const store = storage();
  const response = { answers: [1, 2, 3], comment: 'پیشنهاد', createdAt: 'اکنون' };
  saveResponse(response, store);
  assert.deepEqual(loadResponses(store), [response]);
});

test('میانگین هر سؤال درست محاسبه می‌شود', () => {
  const responses = [
    { answers: Array(QUESTIONS.length).fill(2) },
    { answers: Array(QUESTIONS.length).fill(4) }
  ];
  assert.deepEqual(averages(responses), Array(QUESTIONS.length).fill(3));
});

test('داده خراب به آرایه خالی تبدیل می‌شود', () => {
  const store = { getItem: () => '{خراب', setItem() {} };
  assert.deepEqual(loadResponses(store), []);
});

test('کلید ذخیره‌سازی مشخص و پایدار است', () => {
  assert.equal(STORAGE_KEY, 'teacher-survey-responses');
});