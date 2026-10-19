(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.Calculator = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  class Calculator {
    constructor() { this.clear(); }

    clear() {
      this.display = '0';
      this.previous = null;
      this.operation = null;
      this.waitingForOperand = false;
      this.history = '';
      this.error = false;
      return this;
    }

    inputDigit(digit) {
      if (this.error || this.waitingForOperand) {
        this.display = digit;
        this.waitingForOperand = false;
        this.error = false;
      } else if (this.display === '0') this.display = digit;
      else if (this.display.length < 16) this.display += digit;
      return this;
    }

    decimal() {
      if (this.error || this.waitingForOperand) {
        this.display = '0.';
        this.waitingForOperand = false;
        this.error = false;
      } else if (!this.display.includes('.')) this.display += '.';
      return this;
    }

    chooseOperation(operation) {
      if (this.error) return this.clear();
      const value = Number(this.display);
      if (this.operation && !this.waitingForOperand) {
        const result = this.calculate(this.previous, value, this.operation);
        if (!Number.isFinite(result)) return this.setError();
        this.display = this.format(result);
        this.previous = result;
      } else this.previous = value;
      this.operation = operation;
      this.waitingForOperand = true;
      this.history = `${this.format(this.previous)} ${this.symbol(operation)}`;
      return this;
    }

    equals() {
      if (!this.operation || this.previous === null || this.error) return this;
      const current = Number(this.display);
      const result = this.calculate(this.previous, current, this.operation);
      if (!Number.isFinite(result)) return this.setError();
      this.history = `${this.format(this.previous)} ${this.symbol(this.operation)} ${this.format(current)} =`;
      this.display = this.format(result);
      this.previous = null;
      this.operation = null;
      this.waitingForOperand = true;
      return this;
    }

    backspace() {
      if (this.error || this.waitingForOperand) return this;
      this.display = this.display.length > 1 ? this.display.slice(0, -1) : '0';
      if (this.display === '-') this.display = '0';
      return this;
    }

    toggleSign() {
      if (this.error || this.display === '0') return this;
      this.display = this.display.startsWith('-') ? this.display.slice(1) : `-${this.display}`;
      return this;
    }

    percent() {
      if (this.error) return this;
      this.display = this.format(Number(this.display) / 100);
      return this;
    }

    calculate(a, b, operation) {
      if (operation === 'add') return a + b;
      if (operation === 'subtract') return a - b;
      if (operation === 'multiply') return a * b;
      if (operation === 'divide') return b === 0 ? NaN : a / b;
      return b;
    }

    format(value) {
      if (!Number.isFinite(value)) return 'خطا';
      return String(Number(value.toPrecision(12)));
    }

    setError() {
      this.display = 'خطا';
      this.error = true;
      this.previous = null;
      this.operation = null;
      return this;
    }

    symbol(operation) { return { add: '+', subtract: '−', multiply: '×', divide: '÷' }[operation]; }
  }
  return Calculator;
}));
