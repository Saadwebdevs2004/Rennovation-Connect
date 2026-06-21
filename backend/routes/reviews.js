const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/reviews', requireAuth, requireRole(['Homeowner', 'Admin']), reviewsController.submitReview);
router.get('/reviews/worker/:workerId', requireAuth, reviewsController.getWorkerReviews);
router.put('/reviews/:id/dispute', requireAuth, requireRole(['Worker', 'Admin']), reviewsController.disputeReview);

module.exports = router;
