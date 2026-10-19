const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDigits, cleanPhone, validateContact, addContact, updateContact, deleteContact, searchContacts, sortContacts } = require('../app.js');

test('تبدیل ارقام فارسی و پاک‌سازی شماره انجام می‌شود', () => {
  assert.equal(normalizeDigits('۰۹۱۲۳'), '09123');
  assert.equal(cleanPhone('(۰۹۱۲) ۱۲۳-۴۵۶۷'), '09121234567');
});

test('اعتبارسنجی نام و شماره تلفن', () => {
  assert.equal(validateContact({ name: 'علی رضایی', phone: '۰۹۱۲۱۲۳۴۵۶۷' }).valid, true);
  assert.equal(validateContact({ name: 'ا', phone: '۱۲۳' }).valid, false);
});

test('افزودن و ویرایش مخاطب', () => {
  const contacts = addContact([], { id: 'one', name: 'سارا', phone: '09120000000', group: 'دوستان' });
  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].phone, '09120000000');
  const updated = updateContact(contacts, 'one', { name: 'سارا احمدی', phone: '09121111111' });
  assert.equal(updated[0].name, 'سارا احمدی');
  assert.equal(updated[0].phone, '09121111111');
});

test('حذف و جست‌وجو', () => {
  const contacts = [{ id: '1', name: 'علی', phone: '09121111111', group: 'خانواده' }, { id: '2', name: 'مریم', phone: '09352222222', group: 'دوستان' }];
  assert.equal(searchContacts(contacts, 'مریم').length, 1);
  assert.equal(searchContacts(contacts, '0935').length, 1);
  assert.equal(deleteContact(contacts, '1').length, 1);
});

test('مرتب‌سازی بر اساس نام و جدیدترین', () => {
  const contacts = [{ id: '1', name: 'مریم', phone: '09120000000', createdAt: 1 }, { id: '2', name: 'علی', phone: '09121111111', createdAt: 2 }];
  assert.equal(sortContacts(contacts, 'name')[0].name, 'علی');
  assert.equal(sortContacts(contacts, 'newest')[0].id, '2');
});
