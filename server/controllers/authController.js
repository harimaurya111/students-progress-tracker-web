const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

exports.register = asyncHandler(async (req, res) => {
  const { username = '', email = '', password = '' } = req.body;
  if (username.trim().length < 3 || username.trim().length > 30) throw new ApiError(400, 'Username must be 3–30 characters.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, 'Enter a valid email address.');
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  if (await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.trim() }] }))
    throw new ApiError(409, 'That username or email is already taken.');

  const user = await User.create({ username, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: signToken(user), user: user.toPublic() });
});

exports.login = asyncHandler(async (req, res) => {
  const { email = '', password = '' } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) throw new ApiError(401, 'Wrong email or password.');
  res.json({ token: signToken(user), user: user.toPublic() });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(401, 'Account not found.');
  res.json({ user: user.toPublic() });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const update = {};
  if (req.body.username !== undefined) {
    const u = String(req.body.username).trim();
    if (u.length < 3 || u.length > 30) throw new ApiError(400, 'Username must be 3–30 characters.');
    if (await User.findOne({ username: u, _id: { $ne: req.userId } })) throw new ApiError(409, 'That username is taken.');
    update.username = u;
  }
  if (req.body.avatar !== undefined) update.avatar = String(req.body.avatar);
  const user = await User.findByIdAndUpdate(req.userId, update, { new: true, runValidators: true });
  res.json({ user: user.toPublic() });
});
