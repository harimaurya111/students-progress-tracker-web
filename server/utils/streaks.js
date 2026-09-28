const { addDays, dayDiff } = require('./dates');

// A day counts when at least one task is done.
// Today without a done task yet does not break the current streak; a fully missed day does.
module.exports = function streaks(doneDates, today) {
  const dates = [...doneDates].sort(), set = new Set(dates);
  let longest = 0, run = 0, prev = null;
  for (const d of dates) {
    run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0, d = set.has(today) ? today : addDays(today, -1);
  while (set.has(d)) { current++; d = addDays(d, -1); }
  return { current, longest };
};
