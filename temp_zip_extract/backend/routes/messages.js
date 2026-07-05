const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { requireAuth } = require('../middleware/auth');

router.post('/messages', requireAuth, messagesController.sendMessage);
router.get('/messages/conversations/:userId', requireAuth, messagesController.getConversations);
router.put('/messages/read/:userId/:otherUserId', requireAuth, messagesController.markAsRead);
router.get('/messages/:userId/:otherUserId', requireAuth, messagesController.getChatHistory);

module.exports = router;
