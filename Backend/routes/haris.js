const express = require('express');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

function ensureLandowner(req, res, next) {
  if (req.auth?.userType !== 'landowner') {
    return res.status(403).json({ error: 'Forbidden', message: 'Only landowners can access this resource' });
  }
  next();
}

// Get all Haris (role = hari). Optional query: ?q=searchText
router.get('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const filter = { userType: 'hari' };
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { firstName: re },
        { lastName: re },
        { email: re },
        { phoneNumber: re },
      ];
    }
    const limit = parseInt(req.query.limit || '100', 10) || 100;
    const haris = await User.find(filter).select('_id firstName lastName email phoneNumber').limit(limit);
    res.json(haris);
  } catch (e) {
    console.error('List haris error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch haris' });
  }
});

module.exports = router;


