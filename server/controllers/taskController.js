const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { DATE } = require('../utils/dates');

// Every query below includes userId, so a user can only touch their own tasks.

exports.getTasks = asyncHandler(async (req, res) => {
  if (!DATE.test(req.query.date || '')) throw new ApiError(400, 'A valid date (YYYY-MM-DD) is required.');
  res.json(await Task.find({ userId: req.userId, date: req.query.date }).sort('createdAt'));
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, date } = req.body;
  if (!title?.trim()) throw new ApiError(400, 'Task title is required.');
  if (!DATE.test(date || '')) throw new ApiError(400, 'A valid date is required.');
  res.status(201).json(await Task.create({ userId: req.userId, title, description, date }));
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) throw new ApiError(404, 'Task not found.');

  const { title, description, date, status } = req.body;
  if (title !== undefined) {
    if (!title.trim()) throw new ApiError(400, 'Task title is required.');
    task.title = title;
  }
  if (description !== undefined) task.description = description;
  if (date !== undefined) {
    if (!DATE.test(date)) throw new ApiError(400, 'Invalid date.');
    task.date = date;
  }
  if (status !== undefined) {
    if (!['pending', 'done', 'failed'].includes(status)) throw new ApiError(400, 'Invalid status.');
    task.status = status;
    task.completedAt = status === 'done' ? new Date() : undefined;
  }
  await task.save();
  res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const r = await Task.deleteOne({ _id: req.params.id, userId: req.userId });
  if (!r.deletedCount) throw new ApiError(404, 'Task not found.');
  res.status(204).end();
});
