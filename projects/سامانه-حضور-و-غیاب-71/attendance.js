(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AttendanceLib = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const statuses = ['حاضر', 'غایب', 'تأخیر', 'مرخصی'];

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const date = new Date(value + 'T00:00:00');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function today() {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function saveRecord(records, record) {
    if (!record || !record.personId || !isValidDate(record.date) || !statuses.includes(record.status)) {
      throw new Error('اطلاعات رکورد ناقص یا نامعتبر است.');
    }
    const next = records.filter(item => !(item.personId === record.personId && item.date === record.date));
    next.push({
      id: record.id || createId(),
      personId: record.personId,
      date: record.date,
      status: record.status,
      note: String(record.note || '').trim()
    });
    return next;
  }

  function removeRecord(records, id) {
    return records.filter(record => record.id !== id);
  }

  function filterRecords(records, people, options) {
    const query = String((options && options.query) || '').trim().toLowerCase();
    const date = (options && options.date) || '';
    const status = (options && options.status) || '';
    return records.filter(record => {
      const person = people.find(item => item.id === record.personId);
      const matchesQuery = !query || (person && person.name.toLowerCase().includes(query));
      return matchesQuery && (!date || record.date === date) && (!status || record.status === status);
    });
  }

  return { statuses, today, isValidDate, createId, saveRecord, removeRecord, filterRecords };
});
