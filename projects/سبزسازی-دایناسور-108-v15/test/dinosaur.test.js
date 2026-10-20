const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('رنگ دایناسور سبز کم‌رنگ مناسب است', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /\.dinosaur\s*\{[\s\S]*?fill:\s*#66bb6a/i);
  assert.doesNotMatch(html, /\.dinosaur\s*\{[\s\S]*?fill:\s*(?:#(?:ff0000|f00)|red)/i);
});

test('دکمهٔ شروع بازی در صفحه وجود دارد', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /id="start"/);
});

test('اسکریپت اجرای پروژه تعریف شده است', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts.start, 'node server.js');
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'server.js')), true);
});
