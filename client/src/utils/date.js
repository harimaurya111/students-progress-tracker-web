const p = n => String(n).padStart(2, '0');
export const iso = d => `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
export const today = () => iso(new Date());
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
export const daysIn = (y, m) => new Date(y, m + 1, 0).getDate(); // m is 0-based
export const range = (y, m) => [`${y}-${p(m + 1)}-01`, `${y}-${p(m + 1)}-${p(daysIn(y, m))}`];
export const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
export const nice = s => new Date(s + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const monthName = (y, m) => new Date(y, m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
export const dayClass = s => (!s || !s.total ? 'none' : s.done === 0 ? 'bad' : s.done < s.total ? 'part' : 'good');
export const longestRun = dates => {
  let best = 0, run = 0, prev = null;
  [...dates].sort().forEach(d => { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; });
  return best;
};
// Totals for a list of per-day stats between from..to (inclusive)
export function summarize(stats, from, to) {
  const total = stats.reduce((a, d) => a + d.total, 0), done = stats.reduce((a, d) => a + d.done, 0);
  const activeDates = stats.filter(d => d.done > 0).map(d => d.date);
  const end = to < today() ? to : today();
  const elapsed = end < from ? 0 : Math.round((new Date(end) - new Date(from)) / 864e5) + 1;
  return { total, done, incomplete: total - done, percent: pct(done, total), active: activeDates.length,
    inactive: Math.max(0, elapsed - activeDates.length), longest: longestRun(activeDates) };
}
