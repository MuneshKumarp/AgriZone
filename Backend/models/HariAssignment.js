const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  landownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  hariId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true,
    index: true,
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
    index: true,
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'pending'],
    default: 'active',
  },
}, { timestamps: true });

assignmentSchema.index({ landownerId: 1, hariId: 1, zoneId: 1, cropId: 1 }, { unique: true });

module.exports = mongoose.model('HariAssignment', assignmentSchema);


