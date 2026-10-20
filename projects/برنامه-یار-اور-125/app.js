(() => {
  const core = window.YarAvorCore;
  const STORAGE_KEY = 'yar-avar-tasks-v1';
  let tasks = core.deserialize(localStorage.getItem(STORAGE_KEY));
  let currentFilter = 'all';
  const $ = selector => document.querySelector(selector);
  const list = $('#task-list');

  function save() { localStorage.setItem(STORAGE_KEY, core.serialize(tasks)); }
  function render() {
    const visible = core.filterTasks(tasks, currentFilter);
    const counts = core.stats(tasks);
    $('#all-count').textContent = counts.all.toLocaleString('fa-IR');
    $('#done-count').textContent = counts.done.toLocaleString('fa-IR');
    $('#todo-count').textContent = counts.active.toLocaleString('fa-IR');
    list.innerHTML = '';
    $('#empty-state').hidden = visible.length !== 0;
    visible.forEach(task => {
      const item = document.createElement('article');
      item.className = `task ${task.priority} ${task.done ? 'done' : ''}`;
      item.innerHTML = `<button class="check" data-action="toggle" data-id="${escapeHtml(task.id)}" aria-label="تغییر وضعیت">${task.done ? '✓' : ''}</button><div class="task-content"><div class="task-title">${escapeHtml(task.title)}</div></div><span class="badge ${task.priority}">${core.priorities[task.priority]}</span><button class="delete" data-action="delete" data-id="${escapeHtml(task.id)}" aria-label="حذف کار">×</button>`;
      list.appendChild(item);
    });
  }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }
  $('#task-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try { tasks.unshift(core.createTask(form.get('title'), form.get('priority'))); save(); render(); event.currentTarget.reset(); $('#task-input').focus(); }
    catch (error) { $('#task-input').focus(); }
  });
  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    tasks = button.dataset.action === 'toggle' ? core.toggleTask(tasks, id) : core.removeTask(tasks, id);
    save(); render();
  });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
    render();
  }));
  render();
})();
