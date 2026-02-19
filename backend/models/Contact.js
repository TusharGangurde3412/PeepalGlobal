const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  category: String,
  message: String,
  status: {
    type: String,
    enum: ['received', 'reviewed', 'replied'],
    default: 'received'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
