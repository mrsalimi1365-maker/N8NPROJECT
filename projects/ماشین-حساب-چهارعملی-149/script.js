(() => {
  const CalculatorEngine = window.CalculatorEngine;
  const calculator = new CalculatorEngine();
  const display = document.querySelector('#display');
  const keys = document.querySelector('.keys');
  const toPersian = value => String(value).replace(/[0-9.\-]/g, char => ({'0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹','.':'٫','-':'−'}[char]));

  function render() { display.textContent = toPersian(calculator.getDisplay()); }
  function handle(button) {
    const action = button.dataset.action;
    const value = button.dataset.value;
    if (action === 'clear') calculator.clear();
    else if (action === 'backspace') calculator.backspace();
    else if (action === 'sign') calculator.toggleSign();
    else if (action === 'decimal') calculator.inputDecimal();
    else if (action === 'calculate') calculator.calculate();
    else if (/^[+\-*/]$/.test(value)) calculator.chooseOperator(value);
    else if (/^\d$/.test(value)) calculator.inputDigit(value);
    render();
  }
  keys.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) handle(button);
  });
  document.addEventListener('keydown', event => {
    const key = event.key;
    if (/^\d$/.test(key)) calculator.inputDigit(key);
    else if (key === '.' || key === ',') calculator.inputDecimal();
    else if (/^[+\-*/]$/.test(key)) calculator.chooseOperator(key);
    else if (key === 'Enter' || key === '=') calculator.calculate();
    else if (key === 'Escape') calculator.clear();
    else if (key === 'Backspace') calculator.backspace();
    else return;
    event.preventDefault();
    render();
  });
  render();
})();
