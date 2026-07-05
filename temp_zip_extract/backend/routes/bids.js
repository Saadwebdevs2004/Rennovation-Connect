const express = require('express');
const router = express.Router();
const bidsController = require('../controllers/bidsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/bids', requireAuth, requireRole(['Worker', 'Admin']), bidsController.createBid);
router.get('/bids/job/:jobId', requireAuth, bidsController.getBidsByJobId);
router.get('/bids/worker/:workerId', requireAuth, requireRole(['Worker', 'Admin']), bidsController.getBidsByWorkerId);
router.get('/bids/homeowner/:homeownerId', requireAuth, requireRole(['Homeowner', 'Admin']), bidsController.getBidsByHomeownerId);
router.put('/bids/:id/status', requireAuth, requireRole(['Homeowner', 'Admin']), bidsController.updateBidStatus);

module.exports = router;
