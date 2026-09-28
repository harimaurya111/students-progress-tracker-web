const jwt = require('jsonwebtoken');

exports.signToken = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
