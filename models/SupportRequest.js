const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  orderId: { type: String, default: '' },
  type: { type: String, enum: ['Return', 'Exchange', 'Refund', 'Other'], default: 'Other' },
  reason: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'In Review', 'Resolved', 'Rejected'], default: 'Open' }
}, {
  timestamps: true
});

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);
module.exports = SupportRequest;
