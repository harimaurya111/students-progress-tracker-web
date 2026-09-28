const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');

// Put this on any route that needs a logged-in user. Sets req.userId.
module.exports = (req, res, next) => {
  try {
    req.userId = verifyToken((req.headers.authorization || '').replace('Bearer ', '')).id;
  } catch {
    return next(new ApiError(401, 'Please log in again.'));
  }
  next();
};
