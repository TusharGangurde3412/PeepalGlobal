const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  destinationCountry: {
    type: String,
    trim: true
  },
  incoterm: {
    type: String,
    enum: ['FOB', 'CIF', 'EXW', 'DAP'],
    default: 'FOB'
  },
  requiredBy: Date,
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
