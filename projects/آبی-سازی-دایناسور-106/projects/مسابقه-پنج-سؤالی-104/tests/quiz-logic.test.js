import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, calculateResult, createState, moveToQuestion, selectAnswer } from '../quiz-logic.js';

test('وضعیت اولیه مسابقه خالی و روی سؤال اول است', () => {
  const state = createState(5);
  assert.equal(state.currentQuestion, 0);
  assert.deepEqual(state.answers, [null, null, null, null, null]);
  assert.equal(state.finished, false);
});

test('انتخاب پاسخ فقط پاسخ سؤال فعلی را تغییر می‌دهد', () => {
  let state = createState();
  state = selectAnswer(state, 1);
  state = moveToQuestion(state, 1);
  state = selectAnswer(state, 2);
  assert.deepEqual(state.answers, [1, 2, null, null, null]);
  assert.equal(state.currentQuestion, 1);
});

test('حرکت به شماره سؤال نامعتبر وضعیت را تغییر نمی‌دهد', () => {
  const state = createState();
  assert.deepEqual(moveToQuestion(state, -1), state);
  assert.deepEqual(moveToQuestion(state, 5), state);
});

test('انتخاب پاسخ نامعتبر نادیده گرفته می‌شود', () => {
  const state = createState();
  assert.deepEqual(selectAnswer(state, 9), state);
  assert.deepEqual(selectAnswer(state, -1), state);
});

test('نتیجه درست، نادرست و درصد موفقیت را محاسبه می‌کند', () => {
  const answers = [1, 2, 2, 0, 0];
  const result = calculateResult(QUESTIONS, answers);
  assert.deepEqual(result, { correct: 4, wrong: 1, percentage: 80 });
});

test('نتیجه برای مسابقه بدون سؤال صفر است', () => {
  assert.deepEqual(calculateResult([], []), { correct: 0, wrong: 0, percentage: 0 });
});
