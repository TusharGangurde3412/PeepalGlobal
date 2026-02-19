const express = require('express');
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const { sendOwnerNotification } = require('../services/notificationService');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      productId,
      userId,
      name,
      email,
      phone,
      company,
      quantity,
      destinationCountry,
      incoterm,
      requiredBy,
      message
    } = req.body;

    if (!name || !email || !phone || !quantity) {
      return res.status(400).json({ error: 'name, email, phone and quantity are required' });
    }

    const cleanedProductId = productId ? String(productId).trim() : '';
    const cleanedUserId = userId ? String(userId).trim() : '';

    if (cleanedProductId && !mongoose.Types.ObjectId.isValid(cleanedProductId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (cleanedUserId && !mongoose.Types.ObjectId.isValid(cleanedUserId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const inquiryData = {
      productId: cleanedProductId || undefined,
      userId: cleanedUserId || undefined,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      company: company ? String(company).trim() : '',
      quantity: Number(quantity),
      destinationCountry: destinationCountry ? String(destinationCountry).trim() : '',
      incoterm: incoterm || 'FOB',
      requiredBy: requiredBy || undefined,
      message: message ? String(message).trim() : ''
    };

    const inquiry = new Inquiry(inquiryData);

    if (!Number.isFinite(inquiry.quantity) || inquiry.quantity < 1) {
      return res.status(400).json({ error: 'quantity must be a number greater than 0' });
    }

    await inquiry.save();

    sendOwnerNotification('Inquiry / Quote Request', {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      company: inquiry.company,
      quantity: inquiry.quantity,
      destinationCountry: inquiry.destinationCountry,
      incoterm: inquiry.incoterm,
      requiredBy: inquiry.requiredBy,
      productId: inquiry.productId,
      message: inquiry.message,
      createdAt: inquiry.createdAt
    }).catch(err => {
      console.error('Inquiry notification error:', err.message);
    });

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const { status } = req.query;
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (status) filter.status = status;
    
    const inquiries = await Inquiry.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Inquiry.countDocuments(filter);
    
    res.json({ inquiries, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
