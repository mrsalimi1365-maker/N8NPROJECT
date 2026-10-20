(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.YarAvorCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const priorities = { high: 'مهم', normal: 'معمولی', low: 'کم‌اهمیت' };
  function normalizeTask(task) {
    const value = task || {};
    return {
      id: String(value.id || ''),
      title: String(value.title || '').trim(),
      priority: priorities[value.priority] ? value.priority : 'normal',
      done: value.done === true,
      createdAt: value.createdAt || new Date().toISOString()
    };
  }
  function createTask(title, priority, id) {
    const task = normalizeTask({ id: id || Date.now().toString(), title, priority, done: false });
    if (!task.title) throw new Error('عنوان کار نمی‌تواند خالی باشد');
    return task;
  }
  function toggleTask(tasks, id) {
    return tasks.map(task => task.id === String(id) ? { ...task, done: !task.done } : task);
  }
  function removeTask(tasks, id) { return tasks.filter(task => task.id !== String(id)); }
  function filterTasks(tasks, filter) {
    if (filter === 'active') return tasks.filter(task => !task.done);
    if (filter === 'done') return tasks.filter(task => task.done);
    return tasks.slice();
  }
  function stats(tasks) {
    const done = tasks.filter(task => task.done).length;
    return { all: tasks.length, done, active: tasks.length - done };
  }
  function serialize(tasks) { return JSON.stringify(tasks.map(normalizeTask)); }
  function deserialize(raw) {
    try { const parsed = JSON.parse(raw || '[]'); return Array.isArray(parsed) ? parsed.map(normalizeTask).filter(task => task.title) : []; }
    catch (_) { return []; }
  }
  return { priorities, normalizeTask, createTask, toggleTask, removeTask, filterTasks, stats, serialize, deserialize };
});
