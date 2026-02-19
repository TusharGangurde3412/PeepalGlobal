const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  company: String,
  country: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`[User:pre-save] Password hashed for user ${this.password}`);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(inputPassword) {

  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
