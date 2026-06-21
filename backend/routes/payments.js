const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/payments', requireAuth, requireRole(['Homeowner', 'Admin']), paymentsController.createPayment);
router.get('/payments/pending/:workerId', requireAuth, requireRole(['Worker', 'Admin']), paymentsController.getPendingPayments);
router.put('/payments/:id/approve', requireAuth, requireRole(['Worker', 'Admin']), paymentsController.approvePayment);
router.get('/payments', requireAuth, requireRole(['Admin']), paymentsController.getAllPayments);

module.exports = router;
