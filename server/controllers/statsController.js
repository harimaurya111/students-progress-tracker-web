const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const streaks = require('../utils/streaks');
const { DATE } = require('../utils/dates');

exports.getDays = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!DATE.test(from || '') || !DATE.test(to || '')) throw new ApiError(400, 'from and to dates are required.');
  res.json(await Task.dayStats(req.userId, { date: { $gte: from, $lte: to } }));
});

exports.getSummary = asyncHandler(async (req, res) => {
  const today = DATE.test(req.query.today || '') ? req.query.today : new Date().toISOString().slice(0, 10);
  const days = await Task.dayStats(req.userId);
  const sum = k => days.reduce((a, d) => a + d[k], 0);
  const created = sum('total'), done = sum('done'), failed = sum('failed');
  const doneDays = days.filter(d => d.done > 0).map(d => d.date);
  const s = streaks(doneDays, today);
  res.json({
    created, done, failed, incomplete: created - done,
    percent: created ? Math.round(done / created * 100) : 0,
    activeDays: doneDays.length, currentStreak: s.current, longestStreak: s.longest,
  });
});
