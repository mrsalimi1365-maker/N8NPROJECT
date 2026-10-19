const QUESTIONS = [
  'مطالب درسی با وضوح و قابل‌فهم بودن ارائه می‌شوند؟',
  'سرعت تدریس برای شما مناسب است؟',
  'معلم فرصت کافی برای پرسش و پاسخ فراهم می‌کند؟',
  'مثال‌ها و تمرین‌های ارائه‌شده به یادگیری شما کمک می‌کنند؟',
  'روش تدریس معلم باعث افزایش علاقه شما به درس می‌شود؟',
  'معلم با همه دانش‌آموزان با احترام و عدالت رفتار می‌کند؟',
  'تکالیف و فعالیت‌های کلاسی به‌موقع و روشن توضیح داده می‌شوند؟',
  'بازخوردهای معلم به پیشرفت شما کمک می‌کنند؟',
  'فضای کلاس برای بیان نظر و اشتباه‌کردن امن و مناسب است؟'
];
const SCALE = ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'];
const STORAGE_KEY = 'teacher-survey-responses';

function loadResponses(storage) {
  try { return JSON.parse(storage.getItem(STORAGE_KEY) || '[]'); } catch (_) { return []; }
}
function saveResponse(response, storage) {
  const responses = loadResponses(storage);
  responses.push(response);
  storage.setItem(STORAGE_KEY, JSON.stringify(responses));
  return responses;
}
function averages(responses) {
  return QUESTIONS.map((_, index) => {
    const values = responses.map(r => Number(r.answers[index])).filter(Number.isFinite);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  });
}
function renderQuestions() {
  const root = document.getElementById('questions');
  if (!root) return;
  root.innerHTML = QUESTIONS.map((question, i) => `<fieldset class="question"><legend><span class="number">${i + 1}</span> ${question} <small>(الزامی)</small></legend><div class="options">${SCALE.map((label, value) => `<div class="option"><input required type="radio" id="q${i}-${value + 1}" name="q${i}" value="${value + 1}"><label for="q${i}-${value + 1}">${label}</label></div>`).join('')}</div></fieldset>`).join('');
}
function renderResults() {
  const root = document.getElementById('results-content');
  if (!root) return;
  const responses = loadResponses(window.localStorage);
  if (!responses.length) { root.innerHTML = '<div class="empty">هنوز پاسخی ثبت نشده است.</div>'; return; }
  const avgs = averages(responses);
  const rows = avgs.map((avg, i) => `<div class="average-row"><div><span>${i + 1}. ${QUESTIONS[i]}</span><strong>${avg.toFixed(2)} از ۵</strong></div><div class="bar"><span style="width:${avg * 20}%"></span></div></div>`).join('');
  const comments = responses.filter(r => r.comment && r.comment.trim()).map(r => `<div class="comment">${escapeHtml(r.comment)}</div>`).join('');
  root.innerHTML = `<div class="stats"><div class="stat"><strong>${responses.length}</strong>تعداد پاسخ‌ها</div><div class="stat"><strong>${(avgs.reduce((a, b) => a + b, 0) / QUESTIONS.length).toFixed(2)}</strong>میانگین کل</div></div><h3>میانگین امتیاز هر سؤال</h3>${rows}<div class="comments"><h3>نظرها و پیشنهادها</h3>${comments || '<div class="empty">نظر متنی ثبت نشده است.</div>'}</div>`;
}
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
    renderResults();
    const form = document.getElementById('survey-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) { document.getElementById('error-message').hidden = false; form.reportValidity(); return; }
      const data = new FormData(form);
      const answers = QUESTIONS.map((_, i) => Number(data.get(`q${i}`)));
      saveResponse({ answers, comment: String(data.get('comment') || '').trim(), createdAt: new Date().toISOString() }, window.localStorage);
      form.reset();
      document.getElementById('error-message').hidden = true;
      document.getElementById('success-message').hidden = false;
      renderResults();
    });
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('survey-section').hidden = tab.dataset.target !== 'survey-section';
      document.getElementById('results-section').hidden = tab.dataset.target !== 'results-section';
      if (tab.dataset.target === 'results-section') renderResults();
    }));
    document.getElementById('clear-data').addEventListener('click', () => {
      if (window.confirm('آیا از پاک کردن همه پاسخ‌ها مطمئن هستید؟')) { window.localStorage.removeItem(STORAGE_KEY); renderResults(); }
    });
  });
}
if (typeof module !== 'undefined') module.exports = { QUESTIONS, averages, loadResponses, saveResponse, STORAGE_KEY };