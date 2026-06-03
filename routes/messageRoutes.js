const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// User or Guest sends a message
router.post('/', async (req, res) => {
  try {
    const { userId, guestId, userName, text } = req.body;
    
    // Check if it's the first message from this user/guest
    const query = userId ? { userId } : { guestId };
    const prevMessagesCount = await Message.countDocuments(query);
    
    const userMessage = new Message({
      userId,
      guestId,
      userName,
      text,
      isAdminReply: false
    });
    await userMessage.save();
    
    // Auto-reply logic for Refund/Exchange/Damaged
    const textLower = text.toLowerCase();
    if (prevMessagesCount === 0 || textLower.includes('refund') || textLower.includes('exchange') || textLower.includes('return') || textLower.includes('damaged')) {
      const autoReplyText = "Refund/Exchange/Return is only applicable for damaged products. Please send a product video and photos via this chat for verification.";
      
      const adminReply = new Message({
        userId,
        guestId,
        userName: 'SM Fashion Support',
        text: autoReplyText,
        isAdminReply: true
      });
      await adminReply.save();
      
      return res.status(201).json([userMessage, adminReply]);
    }
    
    res.status(201).json([userMessage]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding message' });
  }
});

// Admin fetching all messages
router.get('/admin', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch(err) {
    res.status(500).json({ message: 'Server error fetched admin messages' });
  }
});

// Admin replying to a message thread
router.post('/admin', async (req, res) => {
  try {
    const { userId, guestId, text } = req.body;
    const adminReply = new Message({
      userId,
      guestId,
      userName: 'SM Fashion Support',
      text,
      isAdminReply: true
    });
    await adminReply.save();
    res.status(201).json(adminReply);
  } catch(err) {
    res.status(500).json({ message: 'Server error admin reply' });
  }
});

// User/Guest fetching their messages
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // guestId or userId
    if (!id || id === 'undefined') return res.status(200).json([]);
    const messages = await Message.find({ $or: [{ userId: id }, { guestId: id }] }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching user messages' });
  }
});

module.exports = router;
