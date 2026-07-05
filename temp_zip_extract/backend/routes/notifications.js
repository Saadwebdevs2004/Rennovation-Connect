const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { requireAuth } = require('../middleware/auth');

router.get('/notifications/:userId', requireAuth, notificationsController.getNotifications);
router.put('/notifications/:id/read', requireAuth, notificationsController.markAsRead);
router.put('/notifications/user/:userId/read-all', requireAuth, notificationsController.markAllAsRead);

module.exports = router;
