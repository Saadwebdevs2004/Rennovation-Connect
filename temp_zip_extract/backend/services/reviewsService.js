const db = require('../config/database');

class ReviewsService {
  async submitReview({ job_id, reviewer_id, reviewee_id, rating, comment }) {
    // Verify job is completed
    const [jobs] = await db.query("SELECT status FROM jobs WHERE id = ?", [job_id]);
    if (jobs.length === 0 || jobs[0].status !== 'completed') {
      const err = new Error("Job must be completed to leave a review.");
      err.status = 400;
      throw err;
    }

    // Check if review already exists
    const [existing] = await db.query("SELECT id FROM reviews WHERE job_id = ? AND reviewer_id = ?", [job_id, reviewer_id]);
    if (existing.length > 0) {
      const err = new Error("You have already reviewed this job.");
      err.status = 400;
      throw err;
    }

    const sql = "INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [job_id, reviewer_id, reviewee_id, rating, comment]);
    return { message: "Review submitted successfully!", id: result.insertId };
  }

  async getWorkerReviews(workerId) {
    const sql = `
      SELECT r.*, j.title as job_title, u.FullName as reviewer_name 
      FROM reviews r
      JOIN jobs j ON r.job_id = j.id
      JOIN users u ON r.reviewer_id = u.UserID
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `;
    const [results] = await db.query(sql, [workerId]);
    return results;
  }

  async disputeReview(id) {
    await db.query("UPDATE reviews SET is_disputed = true WHERE id = ?", [id]);
    return { message: "Review disputed successfully. It will be reviewed by an admin." };
  }
}

module.exports = new ReviewsService();
