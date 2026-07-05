const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/worker/profile/:id', requireAuth, usersController.getWorkerProfile);
router.get('/users/:id', requireAuth, usersController.getUserProfile);
router.put('/users/:id', requireAuth, usersController.updateUserProfile);
router.get('/users', requireAuth, requireRole(['Admin']), usersController.getAllUsers);

module.exports = router;
