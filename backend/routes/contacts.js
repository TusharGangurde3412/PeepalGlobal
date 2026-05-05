const express = require('express');
const Contact = require('../models/Contact');
const { sendOwnerNotification } = require('../services/notificationService');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    sendOwnerNotification('Contact Message', {
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
      email: contact.email,
      phone: contact.phone,
      category: contact.category,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt
    }).then((result) => {
      if (!result || !result.success) {
        console.error('Contact notification failed', {
          contactId: contact._id,
          reason: result?.reason || 'unknown'
        });
      }
    }).catch(err => {
      console.error('Contact notification error:', err.message);
    });

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Contact.countDocuments();
    
    res.json({ contacts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
