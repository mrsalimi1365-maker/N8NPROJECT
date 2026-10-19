(() => {
  'use strict';

  const canvas = document.getElementById('drawingCanvas');
  const colorPicker = document.getElementById('colorPicker');
  const brushSize = document.getElementById('brushSize');
  const sizeValue = document.getElementById('sizeValue');
  const eraserButton = document.getElementById('eraserButton');
  const undoButton = document.getElementById('undoButton');
  const clearButton = document.getElementById('clearButton');
  const saveButton = document.getElementById('saveButton');
  const context = canvas.getContext('2d');
  let drawing = false;
  let erasing = false;
  let lastPoint = null;
  let history = [];

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const oldCanvas = document.createElement('canvas');
    oldCanvas.width = canvas.width;
    oldCanvas.height = canvas.height;
    if (canvas.width && canvas.height) oldCanvas.getContext('2d').drawImage(canvas, 0, 0);
    const ratio = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (oldCanvas.width && oldCanvas.height) context.drawImage(oldCanvas, 0, 0, bounds.width, bounds.height);
  }

  function pointFromEvent(event) {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function saveState() {
    history.push(context.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 20) history.shift();
  }

  function restoreState(state) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(state, 0, 0);
    context.restore();
    const ratio = canvas.width / canvas.getBoundingClientRect().width;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function beginDrawing(event) {
    event.preventDefault();
    drawing = true;
    lastPoint = pointFromEvent(event);
    saveState();
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(lastPoint.x + 0.01, lastPoint.y + 0.01);
    context.stroke();
  }

  function draw(event) {
    if (!drawing) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint = point;
  }

  function finishDrawing() {
    if (!drawing) return;
    drawing = false;
    lastPoint = null;
    context.closePath();
  }

  function configureBrush() {
    context.lineWidth = Number(brushSize.value);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = colorPicker.value;
    context.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
  }

  brushSize.addEventListener('input', () => {
    sizeValue.value = brushSize.value;
    sizeValue.textContent = brushSize.value;
    configureBrush();
  });
  colorPicker.addEventListener('input', configureBrush);
  eraserButton.addEventListener('click', () => {
    erasing = !erasing;
    eraserButton.setAttribute('aria-pressed', String(erasing));
    eraserButton.textContent = erasing ? 'قلم' : 'پاک‌کن';
    configureBrush();
  });
  undoButton.addEventListener('click', () => {
    const previous = history.pop();
    if (previous) restoreState(previous);
  });
  clearButton.addEventListener('click', () => {
    saveState();
    context.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
  });
  saveButton.addEventListener('click', () => {
    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const outputContext = output.getContext('2d');
    outputContext.fillStyle = '#ffffff';
    outputContext.fillRect(0, 0, output.width, output.height);
    outputContext.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = 'نقاشی-من.png';
    link.href = output.toDataURL('image/png');
    link.click();
  });

  canvas.addEventListener('pointerdown', beginDrawing);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', finishDrawing);
  canvas.addEventListener('pointercancel', finishDrawing);
  canvas.addEventListener('pointerleave', finishDrawing);
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  configureBrush();
})();
