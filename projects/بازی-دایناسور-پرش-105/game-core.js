(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DinoGame = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  class DinoGame {
    constructor(options = {}) {
      this.width = options.width || 900;
      this.height = options.height || 300;
      this.groundY = options.groundY || 245;
      this.random = options.random || Math.random;
      this.reset();
    }

    reset() {
      this.state = 'ready';
      this.score = 0;
      this.speed = 280;
      this.spawnTimer = 0.8;
      this.dino = { x: 90, y: this.groundY - 52, width: 42, height: 52, vy: 0, grounded: true };
      this.obstacles = [];
    }

    start() {
      if (this.state === 'gameover') this.reset();
      this.state = 'playing';
      return this.state;
    }

    jump() {
      if (this.state !== 'playing' || !this.dino.grounded) return false;
      this.dino.vy = -650;
      this.dino.grounded = false;
      return true;
    }

    startOrJump() {
      if (this.state === 'ready' || this.state === 'gameover') this.start();
      return this.jump();
    }

    addObstacle(x = this.width + 20, width = 22, height = 42) {
      this.obstacles.push({ x, y: this.groundY - height, width, height });
    }

    update(dt) {
      if (this.state !== 'playing') return;
      dt = Math.min(Math.max(dt, 0), 1);
      this.score += dt * 10;
      this.speed = 280 + Math.min(this.score * 2.2, 260);

      const gravity = 1800;
      this.dino.y += this.dino.vy * dt + 0.5 * gravity * dt * dt;
      this.dino.vy += gravity * dt;
      if (this.dino.y + this.dino.height >= this.groundY) {
        this.dino.y = this.groundY - this.dino.height;
        this.dino.vy = 0;
        this.dino.grounded = true;
      }

      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        const height = this.random() > 0.7 ? 58 : 38 + Math.floor(this.random() * 13);
        const width = this.random() > 0.75 ? 38 : 22;
        this.addObstacle(this.width + 10, width, height);
        this.spawnTimer = Math.max(0.62, 1.15 - this.speed / 1200) + this.random() * 0.65;
      }
      for (const obstacle of this.obstacles) obstacle.x -= this.speed * dt;
      this.obstacles = this.obstacles.filter(obstacle => obstacle.x + obstacle.width > -10);
      if (this.obstacles.some(obstacle => this.collides(this.dino, obstacle))) this.state = 'gameover';
    }

    collides(a, b) {
      const pad = 6;
      return a.x + pad < b.x + b.width && a.x + a.width - pad > b.x &&
        a.y + pad < b.y + b.height && a.y + a.height - 3 > b.y;
    }
  }
  return DinoGame;
}));
