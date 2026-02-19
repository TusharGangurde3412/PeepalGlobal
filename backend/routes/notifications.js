const express = require('express');
const Inquiry = require('../models/Inquiry');
const Contact = require('../models/Contact');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, requireAdmin, async (req, res) => {
  try {
    const [pendingInquiries, unreadContacts, totalInquiries, totalContacts] = await Promise.all([
      Inquiry.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'received' }),
      Inquiry.countDocuments(),
      Contact.countDocuments()
    ]);

    res.json({
      pendingInquiries,
      unreadContacts,
      totalInquiries,
      totalContacts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
