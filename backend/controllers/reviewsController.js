const reviewsService = require('../services/reviewsService');

class ReviewsController {
  async submitReview(req, res) {
    try {
      const { job_id, reviewer_id, reviewee_id, rating, comment } = req.body;
      const result = await reviewsService.submitReview({ job_id, reviewer_id, reviewee_id, rating, comment });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(error.status || 500).json({ error: error.message || "Failed to submit review." });
    }
  }

  async getWorkerReviews(req, res) {
    try {
      const { workerId } = req.params;
      const results = await reviewsService.getWorkerReviews(workerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews." });
    }
  }

  async disputeReview(req, res) {
    try {
      const { id } = req.params;
      const result = await reviewsService.disputeReview(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error disputing review:", error);
      res.status(500).json({ error: "Failed to dispute review." });
    }
  }
}

module.exports = new ReviewsController();
