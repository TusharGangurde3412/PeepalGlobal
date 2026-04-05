const express = require('express');
const Product = require('../models/Product');
const { authenticate, requireRoles } = require('../middleware/auth');

const router = express.Router();

function toProductResponse(product) {
  if (!product) return product;
  const data = product.toObject ? product.toObject() : { ...product };
  if (data.owner && typeof data.owner === 'object') {
    data.owner = {
      _id: data.owner._id,
      email: data.owner.email,
      firstName: data.owner.firstName,
      lastName: data.owner.lastName,
      role: data.owner.role
    };
  }
  return data;
}

function canManageProduct(user, product) {
  if (!user || !product) return false;
  if (user.role === 'admin') return true;
  return String(product.owner || '') === String(user._id || user.id || '');
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.max(Number(req.query.limit || 12), 1);
    const { category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
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

router.get('/my', authenticate, requireRoles('seller', 'admin'), async (req, res) => {
  try {
    const user = req.authUser;
    const filter = user.role === 'admin' ? {} : { owner: req.userId };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate('owner', 'email firstName lastName role');

    res.json({ products: products.map(toProductResponse) });
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

router.post('/', authenticate, requireRoles('admin', 'seller'), async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    const isAdmin = req.authUser?.role === 'admin';


    const images = Array.isArray(req.body.images)
      ? req.body.images.map((img) => String(img).trim()).filter(Boolean)
      : req.body.image ? [String(req.body.image).trim()] : [];
    const specs = Array.isArray(req.body.specs)
      ? req.body.specs.map((s) => String(s).trim()).filter(Boolean)
      : [];

    const product = new Product({
      name: String(name).trim(),
      description: req.body.description ? String(req.body.description).trim() : '',
      category: String(category).trim(),
      price: Number(req.body.price || 0),
      images,
      specs,
      featured: isAdmin ? Boolean(req.body.featured) : false,
      inStock: req.body.inStock !== false,
      owner: isAdmin && req.body.owner ? req.body.owner : req.userId
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, requireRoles('admin', 'seller'), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const user = req.authUser;

    if (!canManageProduct(user, existing)) {
      return res.status(403).json({ error: 'Forbidden: you can update only your own products' });
    }

    const isAdmin = user?.role === 'admin';

    const updates = {
      name: req.body.name ? String(req.body.name).trim() : undefined,
      description: req.body.description !== undefined ? String(req.body.description).trim() : undefined,
      category: req.body.category ? String(req.body.category).trim() : undefined,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      images: Array.isArray(req.body.images)
        ? req.body.images.map((img) => String(img).trim()).filter(Boolean)
        : req.body.image !== undefined ? [String(req.body.image).trim()] : undefined,
      specs: Array.isArray(req.body.specs)
        ? req.body.specs.map((s) => String(s).trim()).filter(Boolean)
        : undefined,
      featured: req.body.featured !== undefined ? (isAdmin ? Boolean(req.body.featured) : existing.featured) : undefined,
      inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : undefined
    };

    if (isAdmin && req.body.owner !== undefined) {
      updates.owner = req.body.owner;
    }

    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));

    const product = await Product.findByIdAndUpdate(req.params.id, cleaned, {
      new: true,
      runValidators: true
    });

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireRoles('admin', 'seller'), async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const user = req.authUser;

    if (!canManageProduct(user, existing)) {
      return res.status(403).json({ error: 'Forbidden: you can delete only your own products' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
