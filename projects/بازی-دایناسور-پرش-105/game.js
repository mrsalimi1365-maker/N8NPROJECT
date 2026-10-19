(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const statusEl = document.getElementById('status');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayText = document.getElementById('overlay-text');
  const restart = document.getElementById('restart');
  const game = new DinoGame({ width: canvas.width, height: canvas.height });
  let best = Number(localStorage.getItem('dino-best') || 0);
  let previous = performance.now();
  bestEl.textContent = String(Math.floor(best)).padStart(5, '0');

  function startInput() {
    if (game.state === 'gameover') game.reset();
    game.startOrJump();
    updateOverlay();
    canvas.focus();
  }

  function updateOverlay() {
    scoreEl.textContent = String(Math.floor(game.score)).padStart(5, '0');
    if (game.state === 'playing') {
      overlay.hidden = true;
      statusEl.textContent = 'بپر و رکوردت را بهتر کن!';
    } else if (game.state === 'gameover') {
      overlay.hidden = false;
      overlayTitle.textContent = 'باختی!';
      overlayText.textContent = `امتیاز شما: ${Math.floor(game.score)} — دوباره تلاش کن`;
      restart.textContent = 'شروع دوباره';
      statusEl.textContent = 'بازی تمام شد';
      if (game.score > best) {
        best = game.score;
        localStorage.setItem('dino-best', String(Math.floor(best)));
        bestEl.textContent = String(Math.floor(best)).padStart(5, '0');
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d8d8d8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, game.groundY); ctx.lineTo(canvas.width, game.groundY); ctx.stroke();
    ctx.fillStyle = '#444';
    for (let i = 0; i < 14; i++) {
      const x = ((i * 97 + Math.floor(game.score * 5)) % 950) - 40;
      ctx.fillRect(x, game.groundY + 13 + (i % 3) * 7, 18 + (i % 4) * 7, 2);
    }
    ctx.fillStyle = '#333';
    const d = game.dino;
    ctx.fillRect(d.x + 8, d.y + 12, 30, 35);
    ctx.fillRect(d.x + 25, d.y + 3, 20, 25);
    ctx.fillRect(d.x + 39, d.y + 17, 13, 7);
    ctx.fillRect(d.x + 5, d.y + 44, 8, 9);
    ctx.fillRect(d.x + 28, d.y + 44, 8, 9);
    ctx.fillStyle = '#fff'; ctx.fillRect(d.x + 38, d.y + 8, 4, 4);
    ctx.fillStyle = '#444';
    for (const o of game.obstacles) {
      ctx.fillRect(o.x + 7, o.y, o.width - 7, o.height);
      ctx.fillRect(o.x, o.y + 12, o.width, 9);
      if (o.width > 30) ctx.fillRect(o.x - 7, o.y + 25, 10, 8);
    }
  }

  function frame(now) {
    game.update((now - previous) / 1000);
    previous = now;
    draw(); updateOverlay();
    requestAnimationFrame(frame);
  }

  document.addEventListener('keydown', event => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      startInput();
    }
  });
  canvas.addEventListener('pointerdown', event => { event.preventDefault(); startInput(); });
  restart.addEventListener('click', startInput);
  draw(); requestAnimationFrame(frame);
})();
