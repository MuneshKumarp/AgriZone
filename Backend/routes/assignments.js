const express = require('express');
const { requireAuth } = require('../middleware/auth');
const HariAssignment = require('../models/HariAssignment');
const User = require('../models/User');
const Zone = require('../models/Zone');
const Crop = require('../models/Crop');

const router = express.Router();

function ensureLandowner(req, res, next) {
  if (req.auth?.userType !== 'landowner') {
    return res.status(403).json({ error: 'Forbidden', message: 'Only landowners can manage assignments' });
  }
  next();
}

// Validate that all refs belong to same landowner
async function validateOwnership(landownerId, hariId, zoneId, cropId) {
  const [hari, zone, crop] = await Promise.all([
    User.findOne({ _id: hariId, userType: 'hari' }),
    Zone.findOne({ _id: zoneId, landownerId }),
    Crop.findOne({ _id: cropId, landownerId }),
  ]);
  return Boolean(hari && zone && crop);
}

// Create assignment
router.post('/', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const landownerId = req.auth.userId;
    const { hariId, zoneId, cropId, status = 'active' } = req.body;
    if (!hariId || !zoneId || !cropId) {
      return res.status(400).json({ error: 'Validation error', message: 'hariId, zoneId, and cropId are required' });
    }
    const ok = await validateOwnership(landownerId, hariId, zoneId, cropId);
    if (!ok) {
      return res.status(400).json({ error: 'Invalid references', message: 'Hari/Zone/Crop must belong to the same landowner' });
    }
    // Enforce one crop per hari per zone at a time
    const exists = await HariAssignment.findOne({ landownerId, hariId, zoneId, status: { $in: ['active', 'pending'] } });
    if (exists) {
      return res.status(409).json({ error: 'Conflict', message: 'Hari already has an active assignment in this zone' });
    }

    const assignment = await HariAssignment.create({ landownerId, hariId, zoneId, cropId, status });
    res.status(201).json(assignment);
  } catch (e) {
    console.error('Create assignment error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to create assignment' });
  }
});

// List landowner assignments
router.get('/', requireAuth, async (req, res) => {
  try {
    const { userType, userId } = req.auth || {};
    if (userType === 'landowner') {
      const list = await HariAssignment.find({ landownerId: userId })
        .populate('hariId', 'firstName lastName email phoneNumber')
        .populate('zoneId', 'name')
        .populate('cropId', 'name type season')
        .sort({ createdAt: -1 });
      return res.json(list);
    }
    if (userType === 'hari') {
      const own = await HariAssignment.find({ hariId: userId, status: { $in: ['active', 'pending'] } })
        .populate('zoneId', 'name')
        .populate('cropId', 'name type season');
      return res.json(own);
    }
    return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized role' });
  } catch (e) {
    console.error('List assignments error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch assignments' });
  }
});

// Update assignment (zone/crop/status)
router.put('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const landownerId = req.auth.userId;
    const { id } = req.params;
    const { zoneId, cropId, status } = req.body;

    const updateData = {};
    if (zoneId) updateData.zoneId = zoneId;
    if (cropId) updateData.cropId = cropId;
    if (status) updateData.status = status;

    if (zoneId || cropId) {
      const current = await HariAssignment.findOne({ _id: id, landownerId });
      if (!current) return res.status(404).json({ error: 'Not found', message: 'Assignment not found' });
      const valid = await validateOwnership(landownerId, current.hariId, zoneId || current.zoneId, cropId || current.cropId);
      if (!valid) return res.status(400).json({ error: 'Invalid references', message: 'Zone/Crop must belong to the same landowner' });
    }

    const updated = await HariAssignment.findOneAndUpdate({ _id: id, landownerId }, { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found', message: 'Assignment not found' });
    res.json(updated);
  } catch (e) {
    console.error('Update assignment error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to update assignment' });
  }
});

// Delete assignment
router.delete('/:id', requireAuth, ensureLandowner, async (req, res) => {
  try {
    const landownerId = req.auth.userId;
    const { id } = req.params;
    const deleted = await HariAssignment.findOneAndDelete({ _id: id, landownerId });
    if (!deleted) return res.status(404).json({ error: 'Not found', message: 'Assignment not found' });
    res.json({ success: true });
  } catch (e) {
    console.error('Delete assignment error:', e);
    res.status(500).json({ error: 'Server error', message: 'Failed to delete assignment' });
  }
});

module.exports = router;


