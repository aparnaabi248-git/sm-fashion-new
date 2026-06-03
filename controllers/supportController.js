const SupportRequest = require('../models/SupportRequest');

// @desc    Create a new support request (returns/exchanges/refunds)
// @route   POST /api/support
// @access  Public
const createSupportRequest = async (req, res) => {
  try {
    const { name, email, orderId, type, reason, message } = req.body;

    if (!name || !email || !reason) {
      return res.status(400).json({ message: 'Name, email and reason are required.' });
    }

    const supportRequest = new SupportRequest({
      userId: req.user ? req.user._id : undefined,
      name,
      email,
      orderId: orderId || '',
      type: ['Return', 'Exchange', 'Refund', 'Other'].includes(type) ? type : 'Other',
      reason,
      message: message || ''
    });

    const created = await supportRequest.save();
    res.status(201).json({ message: 'Support request created.', request: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all support requests
// @route   GET /api/support
// @access  Admin
const getSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update support request status
// @route   PUT /api/support/:id/status
// @access  Admin
const updateSupportRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Open', 'In Review', 'Resolved', 'Rejected'];

    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status value.' });

    const request = await SupportRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Support request not found.' });

    request.status = status;
    const updated = await request.save();
    res.json({ message: 'Status updated.', request: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's support requests
// @route   GET /api/support/user
// @access  Private
const getUserSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSupportRequest, getSupportRequests, updateSupportRequestStatus, getUserSupportRequests };
