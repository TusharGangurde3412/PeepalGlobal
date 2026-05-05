const express = require('express');
const Inquiry = require('../models/Inquiry');
const Contact = require('../models/Contact');
const { sendOwnerNotification } = require('../services/notificationService');
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

router.post('/test-email', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await sendOwnerNotification('Test Notification', {
      triggeredBy: req.user?.email || req.user?.id || 'admin',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      note: 'Triggered from /api/notifications/test-email'
    });

    if (!result?.success) {
      return res.status(500).json({
        success: false,
        message: 'Email test failed',
        reason: result?.reason || 'unknown'
      });
    }

    res.json({
      success: true,
      message: 'Test email sent',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
