const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Agriculture', 'Automobiles', 'Textiles', 'Industrial', 'Handicrafts', 'Veterinary'],
    required: true
  },
  price: Number,
  images: [{ type: String }], // Array of image URLs/paths
  specs: [{ type: String }], // Array of specification strings
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  // brochure removed
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
