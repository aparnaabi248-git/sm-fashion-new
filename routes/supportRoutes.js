const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createSupportRequest, getSupportRequests, updateSupportRequestStatus, getUserSupportRequests } = require('../controllers/supportController');

router.route('/').post(createSupportRequest).get(protect, admin, getSupportRequests);
router.route('/user').get(protect, getUserSupportRequests);
router.route('/:id/status').put(protect, admin, updateSupportRequestStatus);

module.exports = router;
