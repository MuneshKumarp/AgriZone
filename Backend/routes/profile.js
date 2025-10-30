const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const path = require('path');
const multer = require('multer');

const router = express.Router();

// Multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar_${req.auth.userId}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Get my profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ error: 'Not found', message: 'User not found' });
    res.json({
      id: user._id.toString(),
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fatherName: user.fatherName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      cnic: user.cnic,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch profile' });
  }
});

// Update my profile
router.put('/me', requireAuth, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['firstName', 'middleName', 'lastName', 'fatherName', 'phoneNumber', 'dateOfBirth', 'cnic', 'avatarUrl'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = key === 'dateOfBirth' ? new Date(req.body[key]) : req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.auth.userId, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found', message: 'User not found' });

    res.json({
      id: user._id.toString(),
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fatherName: user.fatherName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      cnic: user.cnic,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Duplicate', message: 'CNIC already in use' });
    }
    res.status(500).json({ error: 'Server error', message: 'Failed to update profile' });
  }
});

// Upload avatar
router.post('/me/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file', message: 'No avatar provided' });
    const relPath = '/uploads/' + req.file.filename;
    await User.findByIdAndUpdate(req.auth.userId, { avatarUrl: relPath });
    res.json({ avatarUrl: relPath });
  } catch (e) {
    res.status(500).json({ error: 'Server error', message: 'Failed to upload avatar' });
  }
});

module.exports = router;


