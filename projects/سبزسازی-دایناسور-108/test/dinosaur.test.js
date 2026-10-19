const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('رنگ دایناسور سبز مناسب است', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /\.dinosaur\s*\{[\s\S]*?fill:\s*#2e7d32/i);
  assert.doesNotMatch(html, /\.dinosaur\s*\{[\s\S]*?fill:\s*(?:#(?:ff0000|f00|ff0000)|red)/i);
});

test('دکمهٔ شروع بازی در صفحه وجود دارد', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /id="start"/);
});
