const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Crop = require('../models/Crop');

const router = express.Router();

function ensureLandowner(req, res, next) {
  if (req.auth?.userType !== 'landowner') {
    return res.status(403).json({ error: 'Forbidden', message: 'Only landowners can manage crops' });
  }
  next();
}

// Create Crop
router.post('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { name, type = '', season = '' } = req.body;
    if (!name) return res.status(400).json({ error: 'Validation error', message: 'Crop name is required' });
    const crop = await Crop.create({ landownerId: req.auth.userId, name, type, season });
    res.status(201).json(crop);
  } catch (e) {
    console.error('Create crop error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to create crop' });
  }
});

// List crops for landowner
// List crops for landowner (supports ?q and ?limit)
router.get('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const limit = parseInt(req.query.limit || '100', 10) || 100;
    const filter = { landownerId: req.auth.userId };
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.name = re;
    }
    const crops = await Crop.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json(crops);
  } catch (e) {
    console.error('List crops error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch crops' });
  }
});

// Update crop
router.put('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, season } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (type !== undefined) update.type = type;
    if (season !== undefined) update.season = season;

    const updated = await Crop.findOneAndUpdate({ _id: id, landownerId: req.auth.userId }, { $set: update }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found', message: 'Crop not found' });
    res.json(updated);
  } catch (e) {
    console.error('Update crop error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to update crop' });
  }
});

// Delete crop
router.delete('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Crop.findOneAndDelete({ _id: id, landownerId: req.auth.userId });
    if (!deleted) return res.status(404).json({ error: 'Not found', message: 'Crop not found' });
    res.json({ success: true });
  } catch (e) {
    console.error('Delete crop error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to delete crop' });
  }
});

module.exports = router;
