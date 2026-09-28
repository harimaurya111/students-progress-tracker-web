const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => next(new ApiError(404, 'Not found.'));

// Must keep all 4 arguments, otherwise Express won't treat it as an error handler.
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) return res.status(err.status).json({ error: err.message });
  if (err.name === 'ValidationError') return res.status(400).json({ error: Object.values(err.errors)[0].message });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id.' });
  console.error(err);
  res.status(500).json({ error: 'Server error. Please try again.' });
};
