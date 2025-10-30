const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Zone = require('../models/Zone');

const router = express.Router();

function ensureLandowner(req, res, next) {
  if (req.auth?.userType !== 'landowner') {
    return res.status(403).json({ error: 'Forbidden', message: 'Only landowners can manage zones' });
  }
  next();
}

// Create Zone
router.post('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { name, location = '', totalArea = 0, description = '' } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Validation error', message: 'Zone name is required' });
    }
    const zone = await Zone.create({
      landownerId: req.auth.userId,
      name,
      location,
      totalArea,
      description,
    });
    res.status(201).json(zone);
  } catch (e) {
    console.error('Create zone error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to create zone' });
  }
});

// Get all Zones for current landowner
// Get all Zones for current landowner. Optional search via ?q and ?limit
router.get('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const limit = parseInt(req.query.limit || '100', 10) || 100;
    const filter = { landownerId: req.auth.userId };
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.name = re;
    }
    const zones = await Zone.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json(zones);
  } catch (e) {
    console.error('List zones error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch zones' });
  }
});

// Update Zone
router.put('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, totalArea, description } = req.body;
    if (name !== undefined && !name) {
      return res.status(400).json({ error: 'Validation error', message: 'Zone name cannot be empty' });
    }
    
    // Only update fields that are provided (not undefined)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (totalArea !== undefined) updateData.totalArea = totalArea;
    if (description !== undefined) updateData.description = description;
    
    const zone = await Zone.findOneAndUpdate(
      { _id: id, landownerId: req.auth.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!zone) {
      return res.status(404).json({ error: 'Not found', message: 'Zone not found' });
    }
    res.json(zone);
  } catch (e) {
    console.error('Update zone error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to update zone' });
  }
});

// Delete Zone
router.delete('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Zone.findOneAndDelete({ _id: id, landownerId: req.auth.userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Not found', message: 'Zone not found' });
    }
    res.json({ success: true });
  } catch (e) {
    console.error('Delete zone error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to delete zone' });
  }
});

module.exports = router;


