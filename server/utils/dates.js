// Dates are plain 'YYYY-MM-DD' strings so a "day" never shifts with timezones.
exports.DATE = /^\d{4}-\d{2}-\d{2}$/;

exports.addDays = (s, n) => {
  const d = new Date(s + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

exports.dayDiff = (a, b) => (Date.parse(b) - Date.parse(a)) / 864e5;
