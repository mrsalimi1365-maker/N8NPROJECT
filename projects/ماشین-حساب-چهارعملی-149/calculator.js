(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CalculatorEngine = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  class CalculatorEngine {
    constructor() { this.clear(); }

    clear() {
      this.input = '0';
      this.previous = null;
      this.operator = null;
      this.waiting = false;
      this.error = false;
    }

    inputDigit(digit) {
      if (this.error) this.clear();
      if (this.waiting) {
        this.input = digit;
        this.waiting = false;
      } else if (this.input === '0') {
        this.input = digit;
      } else if (this.input === '-0') {
        this.input = '-' + digit;
      } else if (this.input.length < 15) {
        this.input += digit;
      }
    }

    inputDecimal() {
      if (this.error) this.clear();
      if (this.waiting) { this.input = '0.'; this.waiting = false; return; }
      if (!this.input.includes('.')) this.input += '.';
    }

    chooseOperator(operator) {
      if (this.error) return;
      if (this.operator && this.waiting) { this.operator = operator; return; }
      if (this.operator && this.previous !== null) this.calculate();
      this.previous = Number(this.input);
      this.operator = operator;
      this.waiting = true;
    }

    calculate() {
      if (this.error || !this.operator || this.previous === null || this.waiting) return;
      const current = Number(this.input);
      let result;
      if (this.operator === '+') result = this.previous + current;
      if (this.operator === '-') result = this.previous - current;
      if (this.operator === '*') result = this.previous * current;
      if (this.operator === '/') {
        if (current === 0) { this.input = 'خطا'; this.error = true; return; }
        result = this.previous / current;
      }
      if (!Number.isFinite(result)) { this.input = 'خطا'; this.error = true; return; }
      this.input = String(Number(result.toPrecision(12)));
      this.previous = null;
      this.operator = null;
      this.waiting = true;
    }

    backspace() {
      if (this.error) { this.clear(); return; }
      if (this.waiting) return;
      this.input = this.input.length > 1 ? this.input.slice(0, -1) : '0';
      if (this.input === '-' || this.input === '-0') this.input = '0';
    }

    toggleSign() {
      if (this.error) return;
      if (this.waiting) {
        this.input = '-0';
        this.waiting = false;
        return;
      }
      if (this.input === '0') {
        this.input = '-0';
        return;
      }
      if (this.input === '-0') {
        this.input = '0';
        return;
      }
      this.input = this.input.startsWith('-') ? this.input.slice(1) : '-' + this.input;
    }

    getDisplay() { return this.input; }
  }
  return CalculatorEngine;
}));
