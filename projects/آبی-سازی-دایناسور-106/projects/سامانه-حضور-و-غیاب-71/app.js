(function () {
  const lib = window.AttendanceLib;
  const KEY = 'school-attendance-v1';
  const initial = { people: [], records: [] };
  let state = load();
  const $ = id => document.getElementById(id);

  function load() {
    try { return Object.assign({}, initial, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) { return { people: [], records: [] }; }
  }
  function persist() { localStorage.setItem(KEY, JSON.stringify(state)); renderAll(); }
  function showToast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400); }
  function escapeHtml(value) { return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function person(id) { return state.people.find(item => item.id === id); }
  function selectedRecord(id, date) { return state.records.find(item => item.personId === id && item.date === date); }

  function renderSummary() {
    const date = $('todayDate').value || lib.today();
    const records = state.records.filter(r => r.date === date);
    $('totalPeople').textContent = state.people.length.toLocaleString('fa-IR');
    $('presentToday').textContent = records.filter(r => r.status === 'حاضر').length.toLocaleString('fa-IR');
    $('absentToday').textContent = records.filter(r => r.status === 'غایب').length.toLocaleString('fa-IR');
    $('lateToday').textContent = records.filter(r => r.status === 'تأخیر').length.toLocaleString('fa-IR');
  }
  function renderToday() {
    const date = $('todayDate').value;
    const query = $('todaySearch').value.trim().toLowerCase();
    const people = state.people.filter(p => p.name.toLowerCase().includes(query));
    $('todayList').innerHTML = people.map(p => {
      const record = selectedRecord(p.id, date);
      return `<div class="person-row"><div class="person-info"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.code || 'بدون کد')}</small></div><div class="status-buttons">${lib.statuses.map(s => `<button class="status-btn ${record && record.status === s ? 'selected' : ''}" data-person="${p.id}" data-status="${s}">${s}</button>`).join('')}</div></div>`;
    }).join('');
    $('todayEmpty').classList.toggle('hidden', people.length !== 0);
    renderSummary();
  }
  function renderHistory() {
    const rows = lib.filterRecords(state.records, state.people, { query: $('historySearch').value, date: $('historyDate').value, status: $('historyStatus').value }).sort((a,b) => b.date.localeCompare(a.date));
    $('historyBody').innerHTML = rows.map(r => `<tr><td>${escapeHtml(person(r.personId)?.name || 'حذف‌شده')}</td><td>${r.date}</td><td><span class="badge ${r.status}">${r.status}</span></td><td>${escapeHtml(r.note) || '—'}</td><td><button class="delete remove-record" data-id="${r.id}">حذف</button></td></tr>`).join('');
    $('historyEmpty').classList.toggle('hidden', rows.length !== 0);
  }
  function renderPeople() {
    $('peopleList').innerHTML = state.people.map(p => `<div class="person-card"><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.code || 'بدون کد')}</small></div><button class="delete remove-person" data-id="${p.id}">حذف</button></div>`).join('');
    $('peopleEmpty').classList.toggle('hidden', state.people.length !== 0);
  }
  function renderAll() { renderSummary(); renderToday(); renderHistory(); renderPeople(); }

  $('todayDate').value = lib.today();
  $('todayDate').addEventListener('change', renderToday);
  $('todaySearch').addEventListener('input', renderToday);
  ['historySearch','historyDate','historyStatus'].forEach(id => $(id).addEventListener('input', renderHistory));
  $('clearFilters').addEventListener('click', () => { $('historySearch').value = ''; $('historyDate').value = ''; $('historyStatus').value = ''; renderHistory(); });
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden')); tab.classList.add('active'); $(tab.dataset.tab).classList.remove('hidden'); }));
  $('todayList').addEventListener('click', e => { const button = e.target.closest('.status-btn'); if (!button) return; const existing = selectedRecord(button.dataset.person, $('todayDate').value); state.records = lib.saveRecord(state.records, { id: existing?.id, personId: button.dataset.person, date: $('todayDate').value, status: button.dataset.status }); persist(); showToast('وضعیت با موفقیت ثبت شد.'); });
  $('markAllPresent').addEventListener('click', () => { state.people.forEach(p => { const old = selectedRecord(p.id, $('todayDate').value); state.records = lib.saveRecord(state.records, { id: old?.id, personId: p.id, date: $('todayDate').value, status: 'حاضر' }); }); persist(); showToast('وضعیت همه افراد حاضر ثبت شد.'); });
  $('personForm').addEventListener('submit', e => { e.preventDefault(); const name = $('personName').value.trim(); if (!name) return; if (state.people.some(p => p.name === name)) return showToast('این فرد قبلاً ثبت شده است.'); state.people.push({ id: lib.createId(), name, code: $('personCode').value.trim() }); $('personName').value = ''; $('personCode').value = ''; persist(); showToast('فرد جدید اضافه شد.'); });
  $('peopleList').addEventListener('click', e => { const button = e.target.closest('.remove-person'); if (!button || !confirm('این فرد و سوابق او حذف شود؟')) return; state.people = state.people.filter(p => p.id !== button.dataset.id); state.records = state.records.filter(r => r.personId !== button.dataset.id); persist(); });
  $('historyBody').addEventListener('click', e => { const button = e.target.closest('.remove-record'); if (!button || !confirm('این رکورد حذف شود؟')) return; state.records = lib.removeRecord(state.records, button.dataset.id); persist(); });
  $('exportData').addEventListener('click', () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'پشتیبان-حضور-و-غیاب.json'; a.click(); URL.revokeObjectURL(a.href); });
  $('importData').addEventListener('change', e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!Array.isArray(data.people) || !Array.isArray(data.records)) throw new Error(); state = data; persist(); showToast('اطلاعات وارد شد.'); } catch (_) { showToast('فایل انتخاب‌شده معتبر نیست.'); } }; reader.readAsText(file); });
  renderAll();
})();
