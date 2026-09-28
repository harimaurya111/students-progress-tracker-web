const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '', maxlength: 300000 }, // URL or small data-URL
}, { timestamps: true });

// What we are allowed to send to the browser (never the password)
userSchema.methods.toPublic = function () {
  return { id: this._id, username: this.username, email: this.email, avatar: this.avatar, createdAt: this.createdAt };
};

module.exports = mongoose.model('User', userSchema);
