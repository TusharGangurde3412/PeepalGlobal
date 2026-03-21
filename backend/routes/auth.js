const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });
    
    const safeRole = role === 'seller' ? 'seller' : 'user';
    user = new User({ email, password, firstName, lastName, role: safeRole });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const inputPassword = String(password || '');
    let isMatch = await user.comparePassword(inputPassword);

    // Legacy compatibility: if old data has plain text password, allow one-time login
    // and upgrade the stored password to bcrypt hash.
    if (!isMatch && user.password === inputPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(inputPassword, salt);
      await user.save();
      isMatch = true;
      console.warn(`[auth:legacy-password-upgrade] Upgraded plain text password for user ${user.email}`);
    }

    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email firstName lastName role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
