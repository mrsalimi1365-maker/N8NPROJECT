const OPERATORS = new Set(['+', '-', '*', '/']);

function tokenize(expression) {
  const tokens = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    const unary = char === '-' &&
      (tokens.length === 0 || OPERATORS.has(tokens[tokens.length - 1]));
    const numberStart = unary ? i + 1 : i;
    const match = expression.slice(numberStart).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);

    if (match) {
      const literal = (unary ? char : '') + match[0];
      const value = Number(literal);
      if (!Number.isFinite(value)) throw new Error('ورودی نامعتبر است');
      tokens.push(value);
      i = numberStart + match[0].length;
      continue;
    }

    if (OPERATORS.has(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    throw new Error('ورودی نامعتبر است');
  }

  if (!tokens.length || typeof tokens[0] !== 'number') throw new Error('ورودی نامعتبر است');
  for (let index = 0; index < tokens.length; index++) {
    const shouldBeNumber = index % 2 === 0;
    if (shouldBeNumber !== (typeof tokens[index] === 'number')) {
      throw new Error('ورودی نامعتبر است');
    }
  }
  return tokens;
}

function normalize(value) {
  if (Object.is(value, -0)) return 0;
  return Number.isFinite(value) ? Number(value.toFixed(12)) : value;
}

export function calculateExpression(expression) {
  const tokens = tokenize(String(expression));
  const values = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  const apply = () => {
    const operator = operators.pop();
    const right = values.pop();
    const left = values.pop();
    if (operator === '/' && right === 0) throw new Error('تقسیم بر صفر مجاز نیست');
    const result = operator === '+' ? left + right :
      operator === '-' ? left - right :
      operator === '*' ? left * right : left / right;
    values.push(normalize(result));
  };

  for (const token of tokens) {
    if (typeof token === 'number') values.push(token);
    else {
      while (operators.length && precedence[operators.at(-1)] >= precedence[token]) apply();
      operators.push(token);
    }
  }
  while (operators.length) apply();
  return normalize(values[0]);
}

export function formatResult(value) {
  return String(normalize(Number(value)));
}

let expression = '';
let justCalculated = false;
const display = typeof document !== 'undefined' ? document.querySelector('#display') : null;

function render(value = expression || '0') {
  if (display) display.textContent = value;
}

function addValue(value) {
  if (justCalculated && /[0-9.]/.test(value)) expression = '';
  justCalculated = false;

  if (value === '.') {
    const current = expression.split(/[+\-*/]/).at(-1);
    if (current.includes('.')) return;
    if (!current) expression += '0';
  }
  expression += value;
  render();
}

function addOperator(operator) {
  if (justCalculated) justCalculated = false;
  if (!expression) {
    if (operator === '-') expression = '-';
    else return;
  } else if (OPERATORS.has(expression.at(-1))) {
    if (operator === '-' && expression.at(-1) !== '-') expression += operator;
    else expression = expression.slice(0, -1) + operator;
  } else expression += operator;
  render();
}

function calculate() {
  if (!expression) return;
  try {
    expression = formatResult(calculateExpression(expression));
    justCalculated = true;
    render();
  } catch (error) {
    render(error.message);
    expression = '';
    justCalculated = true;
  }
}

function clear() {
  expression = '';
  justCalculated = false;
  render();
}

function removeLast() {
  if (justCalculated) return clear();
  expression = expression.slice(0, -1);
  render();
}

if (typeof document !== 'undefined') {
  document.querySelector('.keys').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.action === 'clear') clear();
    else if (button.dataset.action === 'delete') removeLast();
    else if (button.dataset.action === 'equals') calculate();
    else if (OPERATORS.has(button.dataset.value)) addOperator(button.dataset.value);
    else addValue(button.dataset.value);
  });

  document.addEventListener('keydown', (event) => {
    if (/^[0-9.]$/.test(event.key)) addValue(event.key);
    else if (OPERATORS.has(event.key)) addOperator(event.key);
    else if (event.key === 'Enter' || event.key === '=') calculate();
    else if (event.key === 'Escape') clear();
    else if (event.key === 'Backspace') removeLast();
    else return;
    event.preventDefault();
  });
}
