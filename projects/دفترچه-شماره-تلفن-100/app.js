const STORAGE_KEY = 'phonebook-fa-contacts';

function normalizeDigits(value) {
  return String(value ?? '').replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

function cleanPhone(phone) {
  return normalizeDigits(phone).replace(/[\s()-]/g, '');
}

function validateContact(input) {
  const name = String(input.name ?? '').trim();
  const phone = cleanPhone(input.phone);
  const errors = {};
  if (name.length < 2) errors.name = 'نام باید حداقل ۲ حرف داشته باشد.';
  if (!/^\+?\d{7,15}$/.test(phone)) errors.phone = 'شماره تلفن معتبر نیست.';
  return { valid: Object.keys(errors).length === 0, errors, value: { name, phone } };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addContact(contacts, input) {
  const check = validateContact(input);
  if (!check.valid) throw new Error(Object.values(check.errors)[0]);
  const contact = { id: input.id || makeId(), name: check.value.name, phone: check.value.phone, group: String(input.group || '').trim(), notes: String(input.notes || '').trim(), createdAt: input.createdAt || Date.now() };
  return [...contacts, contact];
}

function updateContact(contacts, id, input) {
  const check = validateContact(input);
  if (!check.valid) throw new Error(Object.values(check.errors)[0]);
  return contacts.map(contact => contact.id === id ? { ...contact, name: check.value.name, phone: check.value.phone, group: String(input.group || '').trim(), notes: String(input.notes || '').trim() } : contact);
}

function deleteContact(contacts, id) {
  return contacts.filter(contact => contact.id !== id);
}

function searchContacts(contacts, query) {
  const term = normalizeDigits(query).trim().toLowerCase();
  if (!term) return [...contacts];
  return contacts.filter(contact => `${contact.name} ${contact.phone} ${contact.group}`.toLowerCase().includes(term));
}

function sortContacts(contacts, mode = 'name') {
  return [...contacts].sort((a, b) => {
    if (mode === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
    if (mode === 'group') return (a.group || 'zzz').localeCompare(b.group || 'zzz', 'fa') || a.name.localeCompare(b.name, 'fa');
    return a.name.localeCompare(b.name, 'fa');
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalizeDigits, cleanPhone, validateContact, addContact, updateContact, deleteContact, searchContacts, sortContacts };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let contacts = loadContacts();
  let editingId = null;
  const $ = selector => document.querySelector(selector);
  const form = $('#contactForm');
  const status = $('#status');

  function loadContacts() {
    try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  function saveContacts() { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); }
  function showStatus(message, type = 'success') { status.textContent = message; status.className = `status ${type}`; setTimeout(() => { status.textContent = ''; status.className = 'status'; }, 3500); }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

  function render() {
    const filtered = sortContacts(searchContacts(contacts, $('#searchInput').value), $('#sortSelect').value);
    $('#count').textContent = normalizeDigits(contacts.length).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    $('#emptyState').hidden = filtered.length !== 0;
    $('#emptyState').textContent = contacts.length && !filtered.length ? 'مخاطبی با این جست‌وجو پیدا نشد.' : 'هنوز مخاطبی ثبت نشده است.';
    $('#contactsList').innerHTML = filtered.map(contact => `<article class="contact"><h3>${escapeHtml(contact.name)}</h3>${contact.group ? `<span class="badge">${escapeHtml(contact.group)}</span>` : ''}<div class="contact-phone">${escapeHtml(contact.phone)}</div>${contact.notes ? `<p class="contact-notes">${escapeHtml(contact.notes)}</p>` : ''}<div class="contact-actions"><a class="button call" href="tel:${encodeURIComponent(contact.phone)}">تماس</a><a class="button message" href="sms:${encodeURIComponent(contact.phone)}">پیام</a><button class="button edit" data-edit="${escapeHtml(contact.id)}">ویرایش</button><button class="button delete" data-delete="${escapeHtml(contact.id)}">حذف</button></div></article>`).join('');
  }

  function resetForm() { form.reset(); $('#contactId').value = ''; editingId = null; $('#formTitle').textContent = 'افزودن مخاطب'; $('#saveButton').textContent = 'ذخیره مخاطب'; $('#cancelButton').hidden = true; }
  form.addEventListener('submit', event => { event.preventDefault(); const input = { name: $('#name').value, phone: $('#phone').value, group: $('#group').value, notes: $('#notes').value }; try { contacts = editingId ? updateContact(contacts, editingId, input) : addContact(contacts, input); saveContacts(); render(); resetForm(); showStatus(editingId ? 'مخاطب ویرایش شد.' : 'مخاطب با موفقیت ذخیره شد.'); } catch (error) { showStatus(error.message, 'error'); } });
  $('#cancelButton').addEventListener('click', resetForm);
  $('#searchInput').addEventListener('input', render);
  $('#sortSelect').addEventListener('change', render);
  $('#contactsList').addEventListener('click', event => { const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete; if (editId) { const contact = contacts.find(item => item.id === editId); if (!contact) return; editingId = editId; $('#contactId').value = editId; $('#name').value = contact.name; $('#phone').value = contact.phone; $('#group').value = contact.group; $('#notes').value = contact.notes; $('#formTitle').textContent = 'ویرایش مخاطب'; $('#saveButton').textContent = 'ذخیره تغییرات'; $('#cancelButton').hidden = false; $('#name').focus(); } if (deleteId && confirm('آیا از حذف این مخاطب مطمئن هستید؟')) { contacts = deleteContact(contacts, deleteId); saveContacts(); render(); showStatus('مخاطب حذف شد.'); } });
  $('#exportButton').addEventListener('click', () => { const blob = new Blob([JSON.stringify(contacts, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'phonebook-backup.json'; link.click(); URL.revokeObjectURL(link.href); showStatus('فایل پشتیبان آماده شد.'); });
  $('#importInput').addEventListener('change', event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!Array.isArray(data) || data.some(item => !item.id || !item.name || !item.phone || !validateContact(item).valid)) throw new Error(); contacts = data; saveContacts(); render(); showStatus('اطلاعات با موفقیت وارد شد.'); } catch { showStatus('فایل JSON معتبر نیست.', 'error'); } event.target.value = ''; }; reader.readAsText(file); });
  render();
}
