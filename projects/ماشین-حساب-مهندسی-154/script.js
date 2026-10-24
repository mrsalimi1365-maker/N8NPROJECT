/* منطق مستقل محاسبات؛ برای آزمون‌های Node نیز قابل استفاده است. */
function calculate(a, operator, b) {
  const left = Number(a), right = Number(b);
  if (!Number.isFinite(left) || !Number.isFinite(right)) throw new Error('ورودی نامعتبر است');
  if (operator === '+') return left + right;
  if (operator === '−' || operator === '-') return left - right;
  if (operator === '×' || operator === '*') return left * right;
  if (operator === '÷' || operator === '/') {
    if (right === 0) throw new Error('تقسیم بر صفر ممکن نیست');
    return left / right;
  }
  throw new Error('عملگر نامعتبر است');
}

function trigonometric(value, operation) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error('ورودی نامعتبر است');
  const radians = number * Math.PI / 180;
  if (operation === 'sin') return Math.sin(radians);
  if (operation === 'cos') return Math.cos(radians);
  throw new Error('تابع نامعتبر است');
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'خطا';
  const rounded = Math.abs(value) < 1e-12 ? 0 : Number(value.toFixed(10));
  return String(rounded);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculate, trigonometric, formatNumber };
}

if (typeof document !== 'undefined') {
  const display = document.querySelector('#display');
  const previousDisplay = document.querySelector('#previous');
  const historyElement = document.querySelector('#history');
  let current = '0';
  let stored = null;
  let operator = null;
  let waitingForOperand = false;
  let history = JSON.parse(localStorage.getItem('calculator-history') || '[]');

  const toPersian = text => String(text).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]).replace('.', '٫');
  function refresh() {
    display.textContent = toPersian(current);
    previousDisplay.textContent = stored !== null && operator ? `${toPersian(stored)} ${operator}` : '';
  }
  function renderHistory() {
    historyElement.innerHTML = history.length ? history.map(item => `<li><span>${toPersian(item.expression)}</span><strong>${toPersian(item.result)}</strong></li>`).join('') : '<li class="empty-history">هنوز محاسبه‌ای انجام نشده است</li>';
  }
  function saveHistory(expression, result) {
    history.unshift({ expression, result });
    history = history.slice(0, 12);
    localStorage.setItem('calculator-history', JSON.stringify(history));
    renderHistory();
  }
  function showError(message) {
    current = message;
    stored = operator = null;
    waitingForOperand = true;
    refresh();
  }
  function inputNumber(value) {
    if (waitingForOperand || current === 'خطا' || current === 'تقسیم بر صفر ممکن نیست') { current = value === '.' ? '0.' : value; waitingForOperand = false; }
    else if (value === '.' && current.includes('.')) return;
    else if (current === '0' && value !== '.') current = value;
    else if (current.length < 16) current += value;
    refresh();
  }
  function chooseOperator(nextOperator) {
    if (current === 'خطا' || current === 'تقسیم بر صفر ممکن نیست') return;
    if (operator && !waitingForOperand) perform(false);
    stored = current; operator = nextOperator; waitingForOperand = true; refresh();
  }
  function perform(save = true) {
    if (!operator || stored === null || waitingForOperand) return;
    const expression = `${stored} ${operator} ${current}`;
    try {
      current = formatNumber(calculate(stored, operator, current));
      if (save) saveHistory(expression, current);
      stored = operator = null; waitingForOperand = true; refresh();
    } catch (error) { showError(error.message); }
  }
  function applyTrig(operation) {
    try {
      const input = current;
      current = formatNumber(trigonometric(input, operation));
      saveHistory(`${operation}(${input}°)`, current);
      waitingForOperand = true; refresh();
    } catch (error) { showError(error.message); }
  }
  document.querySelector('.keypad').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const value = button.dataset.value;
    if (action === 'clear') { current = '0'; stored = operator = null; waitingForOperand = false; refresh(); }
    else if (action === 'backspace') { if (!waitingForOperand) current = current.length > 1 ? current.slice(0, -1) : '0'; refresh(); }
    else if (action === 'equals') perform();
    else if (action === 'trig') applyTrig(value);
    else if (button.classList.contains('operator')) chooseOperator(value);
    else inputNumber(value);
  });
  document.querySelector('#clear-history').addEventListener('click', () => { history = []; localStorage.removeItem('calculator-history'); renderHistory(); });
  renderHistory(); refresh();
}
