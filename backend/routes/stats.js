const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/stats/homeowner/:id', requireAuth, requireRole(['Homeowner', 'Admin']), statsController.getHomeownerStats);
router.get('/stats/worker/:id', requireAuth, requireRole(['Worker', 'Admin']), statsController.getWorkerStats);
router.get('/payments/homeowner/:id', requireAuth, requireRole(['Homeowner', 'Admin']), statsController.getHomeownerPayments);
router.get('/payments/worker/:id', requireAuth, requireRole(['Worker', 'Admin']), statsController.getWorkerPayments);
router.get('/stats/admin', requireAuth, requireRole(['Admin']), statsController.getAdminStats);

module.exports = router;
