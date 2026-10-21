const assert = require('node:assert/strict');
const { QUESTIONS, createState, answerQuestion, nextQuestion, getResult } = require('../script.js');

assert.equal(QUESTIONS.length, 5, 'آزمون باید دقیقاً ۵ سؤال داشته باشد');
assert.ok(QUESTIONS.every((question) => question.options.length === 4), 'هر سؤال باید ۴ گزینه داشته باشد');
assert.ok(QUESTIONS.every((question) => question.answer >= 0 && question.answer < 4), 'پاسخ صحیح باید معتبر باشد');

let state = createState();
assert.deepEqual(state, { current: 0, score: 0, selected: null, answered: 0 });
assert.equal(nextQuestion(state).current, 0, 'بدون انتخاب پاسخ نباید به سؤال بعد رفت');

state = answerQuestion(state, QUESTIONS[0].answer);
assert.equal(state.score, 1, 'پاسخ صحیح باید امتیاز را افزایش دهد');
assert.equal(state.answered, 1);
assert.equal(answerQuestion(state, 0).answered, 1, 'پس از انتخاب، پاسخ دوم نباید ثبت شود');
state = nextQuestion(state);
assert.equal(state.current, 1);
assert.equal(state.selected, null, 'انتخاب سؤال قبلی باید پاک شود');

for (let i = 1; i < QUESTIONS.length; i += 1) {
  state = answerQuestion(state, (QUESTIONS[i].answer + 1) % 4);
  state = nextQuestion(state);
}
const result = getResult(state);
assert.equal(result.finished, true, 'پس از سؤال پنجم آزمون باید تمام شود');
assert.equal(result.score, 1);
assert.equal(result.correct + result.wrong, 5);

let perfect = createState();
for (let i = 0; i < QUESTIONS.length; i += 1) {
  perfect = answerQuestion(perfect, QUESTIONS[i].answer);
  perfect = nextQuestion(perfect);
}
assert.deepEqual(getResult(perfect), { score: 5, correct: 5, wrong: 0, finished: true });

console.log('همه تست‌های بازی با موفقیت اجرا شدند.');
