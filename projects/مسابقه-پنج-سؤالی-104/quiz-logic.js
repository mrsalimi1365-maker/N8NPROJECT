export const QUESTIONS = [
  {
    text: 'پایتخت کشور ایران کدام شهر است؟',
    options: ['تبریز', 'تهران', 'شیراز', 'اصفهان'],
    answer: 1
  },
  {
    text: 'کدام سیاره به سیاره سرخ معروف است؟',
    options: ['زهره', 'مشتری', 'مریخ', 'عطارد'],
    answer: 2
  },
  {
    text: 'حاصل ۷ ضربدر ۸ چند است؟',
    options: ['۴۸', '۵۴', '۵۶', '۶۴'],
    answer: 2
  },
  {
    text: 'کدام مورد یک زبان برنامه‌نویسی است؟',
    options: ['جاوااسکریپت', 'فتوشاپ', 'کروم', 'لینوکس'],
    answer: 0
  },
  {
    text: 'بزرگ‌ترین اقیانوس جهان کدام است؟',
    options: ['اطلس', 'هند', 'منجمد شمالی', 'آرام'],
    answer: 3
  }
];

export function createState(questionCount = QUESTIONS.length) {
  return {
    currentQuestion: 0,
    answers: Array(questionCount).fill(null),
    finished: false
  };
}

export function selectAnswer(state, answerIndex) {
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= 4) {
    return state;
  }
  const answers = [...state.answers];
  answers[state.currentQuestion] = answerIndex;
  return { ...state, answers };
}

export function moveToQuestion(state, questionIndex) {
  if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= state.answers.length) {
    return state;
  }
  return { ...state, currentQuestion: questionIndex };
}

export function calculateResult(questions, answers) {
  const correct = questions.reduce((total, question, index) => (
    total + (answers[index] === question.answer ? 1 : 0)
  ), 0);
  const total = questions.length;
  return {
    correct,
    wrong: total - correct,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100)
  };
}
