const express = require('express');
const Product = require('../models/Product');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    
    const skip = (page - 1) * limit;
    const products = await Product.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);
    
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    const product = new Product({
      name: String(name).trim(),
      description: req.body.description ? String(req.body.description).trim() : '',
      category: String(category).trim(),
      price: Number(req.body.price || 0),
      image: req.body.image ? String(req.body.image).trim() : '',
      featured: Boolean(req.body.featured),
      inStock: req.body.inStock !== false
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const updates = {
      name: req.body.name ? String(req.body.name).trim() : undefined,
      description: req.body.description !== undefined ? String(req.body.description).trim() : undefined,
      category: req.body.category ? String(req.body.category).trim() : undefined,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      image: req.body.image !== undefined ? String(req.body.image).trim() : undefined,
      featured: req.body.featured !== undefined ? Boolean(req.body.featured) : undefined,
      inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : undefined
    };

    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));

    const product = await Product.findByIdAndUpdate(req.params.id, cleaned, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
