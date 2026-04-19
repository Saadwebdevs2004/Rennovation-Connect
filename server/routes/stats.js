module.exports = function(app, db) {
  // --- HOMEOWNER STATS ---
  app.get('/api/stats/homeowner/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const [activeJobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE homeownerId = ? AND status = 'open'", [id]);
      const [totalBids] = await db.query("SELECT COUNT(*) as count FROM bids b JOIN jobs j ON b.job_id = j.id WHERE j.homeownerId = ?", [id]);
      const [completedJobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE homeownerId = ? AND status = 'completed'", [id]);
      const [totalSpent] = await db.query("SELECT SUM(amount) as total FROM payments WHERE homeowner_id = ? AND status = 'completed'", [id]);

      res.status(200).json({
        activeJobs: activeJobs[0].count,
        totalBids: totalBids[0].count,
        completedJobs: completedJobs[0].count,
        totalSpent: totalSpent[0].total || 0
      });
    } catch (error) {
      console.error("Error fetching homeowner stats:", error);
      res.status(500).json({ error: "Failed to fetch stats." });
    }
  });

  // --- WORKER STATS ---
  app.get('/api/stats/worker/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const [activeBids] = await db.query("SELECT COUNT(*) as count FROM bids WHERE worker_id = ? AND status = 'pending'", [id]);
      const [jobsWon] = await db.query("SELECT COUNT(*) as count FROM bids WHERE worker_id = ? AND status = 'accepted'", [id]);
      const [earnings] = await db.query("SELECT SUM(amount) as total FROM payments WHERE worker_id = ? AND status = 'completed'", [id]);
      const [rating] = await db.query("SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE reviewee_id = ?", [id]);

      res.status(200).json({
        activeBids: activeBids[0].count,
        jobsWon: jobsWon[0].count,
        earnings: earnings[0].total || 0,
        rating: Number(rating[0].avg || 0).toFixed(1),
        reviewCount: rating[0].count
      });
    } catch (error) {
      console.error("Error fetching worker stats:", error);
      res.status(500).json({ error: "Failed to fetch stats." });
    }
  });

  // --- GET PAYMENTS FOR HOMEOWNER ---
  app.get('/api/payments/homeowner/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT p.*, j.title as job_title, u.fullName as worker_name
        FROM payments p
        JOIN jobs j ON p.job_id = j.id
        JOIN users u ON p.worker_id = u.UserID
        WHERE p.homeowner_id = ?
        ORDER BY p.created_at DESC
      `;
      const [results] = await db.query(sql, [id]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching homeowner payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  });

  // --- GET PAYMENTS FOR WORKER ---
  app.get('/api/payments/worker/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT p.*, j.title as job_title, u.fullName as homeowner_name
        FROM payments p
        JOIN jobs j ON p.job_id = j.id
        JOIN users u ON p.homeowner_id = u.UserID
        WHERE p.worker_id = ?
        ORDER BY p.created_at DESC
      `;
      const [results] = await db.query(sql, [id]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching worker payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  });
};
