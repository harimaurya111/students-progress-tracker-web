const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many attempts. Try again later.' },
});
