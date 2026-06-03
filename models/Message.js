const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestId: { type: String },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  isAdminReply: { type: Boolean, default: false },
  readByAdmin: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
