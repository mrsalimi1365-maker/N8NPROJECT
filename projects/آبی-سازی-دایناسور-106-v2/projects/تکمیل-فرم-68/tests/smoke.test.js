const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (file) => fs.readFileSync(file, 'utf8');

test('static survey project contains the required files and hooks', () => {
  const html = read('index.html');
  const javascript = read('app.js');
  const css = read('styles.css');
  assert.match(html, /id="identityForm"/);
  assert.match(html, /id="surveyForm"/);
  assert.match(html, /localStorage/);
  assert.match(javascript, /brightviewSurveyResponse/);
  assert.match(javascript, /localStorage\.setItem/);
  assert.match(css, /--purple/);
});
