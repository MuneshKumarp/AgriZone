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

// Get all Haris (role = hari)
router.get('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const haris = await User.find({ userType: 'hari' }).select('_id firstName lastName email phoneNumber');
    res.json(haris);
  } catch (e) {
    console.error('List haris error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch haris' });
  }
});

module.exports = router;


