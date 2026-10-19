const test = require('node:test');
const assert = require('node:assert/strict');
const DinoGame = require('../game-core.js');

test('بازی در وضعیت آماده ساخته می‌شود', () => {
  const game = new DinoGame({ random: () => 0.5 });
  assert.equal(game.state, 'ready');
  assert.equal(game.score, 0);
  assert.equal(game.dino.grounded, true);
});

test('شروع بازی و پرش کار می‌کند و پرش دوباره در هوا مجاز نیست', () => {
  const game = new DinoGame();
  assert.equal(game.startOrJump(), true);
  assert.equal(game.state, 'playing');
  assert.equal(game.dino.grounded, false);
  assert.equal(game.jump(), false);
  game.update(0.5);
  assert.ok(game.dino.y < game.groundY - game.dino.height);
});

test('امتیاز، سرعت و موانع در طول بازی افزایش پیدا می‌کنند', () => {
  const game = new DinoGame({ random: () => 0 });
  game.start();
  game.update(1);
  assert.ok(game.score > 0);
  assert.ok(game.speed > 280);
  assert.ok(game.obstacles.length > 0);
});

test('برخورد با مانع بازی را تمام می‌کند', () => {
  const game = new DinoGame();
  game.start();
  game.addObstacle(game.dino.x + 10, 25, 40);
  game.update(0.01);
  assert.equal(game.state, 'gameover');
});

test('بازی پس از پایان با start دوباره آماده اجرا می‌شود', () => {
  const game = new DinoGame();
  game.start();
  game.state = 'gameover';
  game.score = 42;
  game.start();
  assert.equal(game.state, 'playing');
  assert.equal(game.score, 0);
  assert.equal(game.obstacles.length, 0);
});
