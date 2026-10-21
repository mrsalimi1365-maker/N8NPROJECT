(function (root) {
  'use strict';

  const QUESTIONS = [
    { text: 'پایتخت کشور استرالیا کدام شهر است؟', options: ['سیدنی', 'ملبورن', 'کانبرا', 'پرت'], answer: 2 },
    { text: 'بزرگ‌ترین سیاره منظومه شمسی کدام است؟', options: ['زمین', 'مشتری', 'زحل', 'نپتون'], answer: 1 },
    { text: 'چه کسی شاهنامه را سروده است؟', options: ['حافظ', 'سعدی', 'فردوسی', 'مولانا'], answer: 2 },
    { text: 'آب در چند درجه سانتی‌گراد به جوش می‌آید؟', options: ['۵۰', '۷۵', '۱۰۰', '۱۲۵'], answer: 2 },
    { text: 'کدام حیوان به «کشتی صحرا» معروف است؟', options: ['اسب', 'شتر', 'فیل', 'کرگدن'], answer: 1 }
  ];

  function createState() {
    return { current: 0, score: 0, selected: null, answered: 0 };
  }

  function answerQuestion(state, choice) {
    if (!Number.isInteger(choice) || choice < 0 || choice >= 4 || state.selected !== null) return state;
    const next = { ...state, selected: choice, answered: state.answered + 1 };
    if (choice === QUESTIONS[state.current].answer) next.score += 1;
    return next;
  }

  function nextQuestion(state) {
    if (state.selected === null) return state;
    if (state.current >= QUESTIONS.length - 1) return { ...state, current: QUESTIONS.length };
    return { ...state, current: state.current + 1, selected: null };
  }

  function getResult(state) {
    return { score: state.score, correct: state.score, wrong: QUESTIONS.length - state.score, finished: state.current >= QUESTIONS.length };
  }

  const api = { QUESTIONS, createState, answerQuestion, nextQuestion, getResult };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.QuizApp = api;

  if (typeof document === 'undefined') return;

  let state = createState();
  const $ = (id) => document.getElementById(id);
  const faDigits = (value) => String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);
  const quizView = $('quiz-view');
  const resultView = $('result-view');

  function render() {
    if (state.current >= QUESTIONS.length) return renderResult();
    const question = QUESTIONS[state.current];
    $('question-counter').textContent = `سؤال ${faDigits(state.current + 1)} از ${faDigits(QUESTIONS.length)}`;
    $('score-label').textContent = `امتیاز: ${faDigits(state.score)}`;
    $('question-number').textContent = faDigits(String(state.current + 1).padStart(2, '0'));
    $('question-text').textContent = question.text;
    $('progress-bar').style.width = `${((state.current + 1) / QUESTIONS.length) * 100}%`;
    $('next-label').textContent = state.current === QUESTIONS.length - 1 ? 'دیدن نتیجه' : 'سؤال بعدی';
    $('error-message').hidden = true;
    const options = $('options');
    options.innerHTML = '';
    question.options.forEach((text, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `option${state.selected === index ? ' selected' : ''}`;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', state.selected === index ? 'true' : 'false');
      button.innerHTML = `<span class="option-marker">${String.fromCharCode(65 + index)}</span><span>${text}</span>`;
      button.addEventListener('click', () => { state = answerQuestion(state, index); render(); });
      options.appendChild(button);
    });
  }

  function renderResult() {
    const result = getResult(state);
    quizView.hidden = true;
    resultView.hidden = false;
    $('final-score').textContent = faDigits(result.score);
    $('correct-count').textContent = faDigits(result.correct);
    $('wrong-count').textContent = faDigits(result.wrong);
    $('result-message').textContent = result.score >= 4 ? 'عالی بود! اطلاعات عمومی‌ات فوق‌العاده است.' : result.score >= 3 ? 'خوب بود! با کمی تمرین بهتر هم می‌شوی.' : 'تلاش خوبی بود؛ دوباره امتحان کن و رکوردت را بهتر کن.';
  }

  $('next-button').addEventListener('click', () => {
    if (state.selected === null) { $('error-message').hidden = false; return; }
    state = nextQuestion(state);
    render();
  });
  $('restart-button').addEventListener('click', () => { state = createState(); quizView.hidden = false; resultView.hidden = true; render(); });
  render();
}(typeof window !== 'undefined' ? window : globalThis));
