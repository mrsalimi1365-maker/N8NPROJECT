import { QUESTIONS, calculateResult, createState, moveToQuestion, selectAnswer } from './quiz-logic.js';

let state = createState();

const elements = {
  quizView: document.querySelector('#quiz-view'),
  resultView: document.querySelector('#result-view'),
  questionCounter: document.querySelector('#question-counter'),
  progressPercent: document.querySelector('#progress-percent'),
  progressBar: document.querySelector('#progress-bar'),
  questionText: document.querySelector('#question-text'),
  options: document.querySelector('#options'),
  errorMessage: document.querySelector('#error-message'),
  previousButton: document.querySelector('#previous-button'),
  nextButton: document.querySelector('#next-button'),
  restartButton: document.querySelector('#restart-button'),
  correctCount: document.querySelector('#correct-count'),
  wrongCount: document.querySelector('#wrong-count'),
  successRate: document.querySelector('#success-rate'),
  resultMessage: document.querySelector('#result-message')
};

const persianDigits = value => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);

function render() {
  const question = QUESTIONS[state.currentQuestion];
  const questionNumber = state.currentQuestion + 1;
  const percent = Math.round((questionNumber / QUESTIONS.length) * 100);
  elements.questionCounter.textContent = `سؤال ${persianDigits(questionNumber)} از ${persianDigits(QUESTIONS.length)}`;
  elements.progressPercent.textContent = `${persianDigits(percent)}٪`;
  elements.progressBar.style.width = `${percent}%`;
  elements.questionText.textContent = question.text;
  elements.options.replaceChildren();

  question.options.forEach((optionText, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `option${state.answers[state.currentQuestion] === index ? ' selected' : ''}`;
    option.setAttribute('role', 'radio');
    option.setAttribute('aria-checked', String(state.answers[state.currentQuestion] === index));
    option.innerHTML = `<span class="option-marker">${state.answers[state.currentQuestion] === index ? '✓' : ''}</span><span>${optionText}</span>`;
    option.addEventListener('click', () => {
      state = selectAnswer(state, index);
      elements.errorMessage.hidden = true;
      render();
    });
    elements.options.append(option);
  });

  elements.previousButton.disabled = state.currentQuestion === 0;
  elements.nextButton.textContent = state.currentQuestion === QUESTIONS.length - 1 ? 'مشاهده نتیجه' : 'سؤال بعدی';
}

function finishQuiz() {
  const result = calculateResult(QUESTIONS, state.answers);
  state = { ...state, finished: true };
  elements.quizView.hidden = true;
  elements.resultView.hidden = false;
  elements.correctCount.textContent = persianDigits(result.correct);
  elements.wrongCount.textContent = persianDigits(result.wrong);
  elements.successRate.textContent = `${persianDigits(result.percentage)}٪`;
  elements.resultMessage.textContent = result.percentage >= 80
    ? 'عالی بود! دانش شما بسیار خوب است.'
    : result.percentage >= 50
      ? 'خوب بود! با کمی تمرین بهتر هم می‌شوید.'
      : 'اشکالی ندارد؛ دوباره تلاش کنید و نتیجه بهتری بگیرید.';
}

elements.previousButton.addEventListener('click', () => {
  state = moveToQuestion(state, state.currentQuestion - 1);
  elements.errorMessage.hidden = true;
  render();
});

elements.nextButton.addEventListener('click', () => {
  if (state.answers[state.currentQuestion] === null) {
    elements.errorMessage.hidden = false;
    return;
  }
  if (state.currentQuestion === QUESTIONS.length - 1) {
    finishQuiz();
    return;
  }
  state = moveToQuestion(state, state.currentQuestion + 1);
  elements.errorMessage.hidden = true;
  render();
});

elements.restartButton.addEventListener('click', () => {
  state = createState();
  elements.quizView.hidden = false;
  elements.resultView.hidden = true;
  elements.errorMessage.hidden = true;
  render();
});

render();
