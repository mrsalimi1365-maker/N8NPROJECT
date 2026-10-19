(() => {
  const calculator = new Calculator();
  const display = document.querySelector('#display');
  const history = document.querySelector('#history');
  const faDigits = '۰۱۲۳۴۵۶۷۸۹';

  function toPersian(value) {
    return String(value).replace(/[0-9]/g, digit => faDigits[digit]).replace('.', '٫');
  }

  function render() {
    display.textContent = toPersian(calculator.display);
    history.textContent = calculator.history ? toPersian(calculator.history) : '\u00a0';
  }

  function press(button) {
    if (button.dataset.number !== undefined) calculator.inputDigit(button.dataset.number);
    if (button.dataset.operation) calculator.chooseOperation(button.dataset.operation);
    const action = button.dataset.action;
    if (action === 'clear') calculator.clear();
    if (action === 'backspace') calculator.backspace();
    if (action === 'decimal') calculator.decimal();
    if (action === 'equals') calculator.equals();
    if (action === 'toggle-sign') calculator.toggleSign();
    if (action === 'percent') calculator.percent();
    render();
  }

  document.querySelectorAll('button').forEach(button => button.addEventListener('click', () => press(button)));
  document.addEventListener('keydown', event => {
    const key = event.key;
    if (/^[0-9]$/.test(key)) calculator.inputDigit(key);
    else if (key === '.' || key === ',') calculator.decimal();
    else if (key === '+') calculator.chooseOperation('add');
    else if (key === '-') calculator.chooseOperation('subtract');
    else if (key === '*') calculator.chooseOperation('multiply');
    else if (key === '/') { event.preventDefault(); calculator.chooseOperation('divide'); }
    else if (key === 'Enter' || key === '=') calculator.equals();
    else if (key === 'Backspace') calculator.backspace();
    else if (key === 'Escape') calculator.clear();
    else if (key === '%') calculator.percent();
    else return;
    render();
  });
  render();
})();
