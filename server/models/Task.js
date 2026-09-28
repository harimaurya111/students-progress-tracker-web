const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 500 },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  status: { type: String, enum: ['pending', 'done', 'failed'], default: 'pending' },
  completedAt: Date,
}, { timestamps: true });

taskSchema.index({ userId: 1, date: 1 });

// Per-day totals for one user: [{ date, total, done, failed }] sorted by date
taskSchema.statics.dayStats = function (userId, match = {}) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), ...match } },
    { $group: { _id: '$date', total: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } } } },
    { $project: { _id: 0, date: '$_id', total: 1, done: 1, failed: 1 } },
    { $sort: { date: 1 } },
  ]);
};

module.exports = mongoose.model('Task', taskSchema);
