module.exports = (app, db) => {
    // POST /api/reviews - Homeowner submits a review
    app.post('/api/reviews', async (req, res) => {
        try {
            const { job_id, reviewer_id, reviewee_id, rating, comment } = req.body;
            // Verify job is completed
            const [jobs] = await db.query("SELECT status FROM jobs WHERE id = ?", [job_id]);
            if (jobs.length === 0 || jobs[0].status !== 'completed') {
                return res.status(400).json({ error: "Job must be completed to leave a review." });
            }
            
            // Check if review already exists
            const [existing] = await db.query("SELECT id FROM reviews WHERE job_id = ? AND reviewer_id = ?", [job_id, reviewer_id]);
            if (existing.length > 0) {
                return res.status(400).json({ error: "You have already reviewed this job." });
            }

            const sql = "INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
            const [result] = await db.query(sql, [job_id, reviewer_id, reviewee_id, rating, comment]);
            res.status(200).json({ message: "Review submitted successfully!", id: result.insertId });
        } catch (error) {
            console.error("Error submitting review:", error);
            res.status(500).json({ error: "Failed to submit review." });
        }
    });

    // GET /api/reviews/worker/:workerId - Get all reviews for a worker
    app.get('/api/reviews/worker/:workerId', async (req, res) => {
        try {
            const { workerId } = req.params;
            const sql = `
                SELECT r.*, j.title as job_title, u.FullName as reviewer_name 
                FROM reviews r
                JOIN jobs j ON r.job_id = j.id
                JOIN users u ON r.reviewer_id = u.UserID
                WHERE r.reviewee_id = ?
                ORDER BY r.created_at DESC
            `;
            const [results] = await db.query(sql, [workerId]);
            res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ error: "Failed to fetch reviews." });
        }
    });

    // PUT /api/reviews/:id/dispute - Worker disputes a review
    app.put('/api/reviews/:id/dispute', async (req, res) => {
        try {
            const { id } = req.params;
            await db.query("UPDATE reviews SET is_disputed = true WHERE id = ?", [id]);
            res.status(200).json({ message: "Review disputed successfully. It will be reviewed by an admin." });
        } catch (error) {
            console.error("Error disputing review:", error);
            res.status(500).json({ error: "Failed to dispute review." });
        }
    });
};
