const test = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../attendance.js');

const people = [{ id: '1', name: 'علی رضایی' }, { id: '2', name: 'سارا محمدی' }];

test('ثبت رکورد معتبر انجام می‌شود', () => {
  const result = lib.saveRecord([], { personId: '1', date: '2026-10-12', status: 'حاضر' });
  assert.equal(result.length, 1);
  assert.equal(result[0].status, 'حاضر');
});

test('ثبت داده ناقص یا تاریخ نامعتبر رد می‌شود', () => {
  assert.throws(() => lib.saveRecord([], { personId: '1', date: '2026-02-30', status: 'حاضر' }));
  assert.throws(() => lib.saveRecord([], { personId: '', date: '2026-10-12', status: 'حاضر' }));
});

test('ثبت دوباره همان فرد و تاریخ رکورد را تکراری نمی‌کند', () => {
  const first = lib.saveRecord([], { personId: '1', date: '2026-10-12', status: 'حاضر' });
  const second = lib.saveRecord(first, { personId: '1', date: '2026-10-12', status: 'تأخیر' });
  assert.equal(second.length, 1);
  assert.equal(second[0].status, 'تأخیر');
});

test('فیلتر سوابق بر اساس نام، تاریخ و وضعیت کار می‌کند', () => {
  const records = [
    { id: 'a', personId: '1', date: '2026-10-12', status: 'حاضر' },
    { id: 'b', personId: '2', date: '2026-10-11', status: 'غایب' }
  ];
  assert.equal(lib.filterRecords(records, people, { query: 'سارا' }).length, 1);
  assert.equal(lib.filterRecords(records, people, { date: '2026-10-12', status: 'حاضر' }).length, 1);
});

test('حذف رکورد درست انجام می‌شود', () => {
  assert.equal(lib.removeRecord([{ id: 'a' }, { id: 'b' }], 'a').length, 1);
});
