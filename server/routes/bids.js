module.exports = function(app, db) {
  // --- POST A NEW BID ---
  app.post('/api/bids', async (req, res) => {
    try {
      const { job_id, worker_id, amount, proposal_text } = req.body;
      const sql = "INSERT INTO bids (job_id, worker_id, amount, proposal_text) VALUES (?, ?, ?, ?)";
      const values = [job_id, worker_id, amount, proposal_text];
      
      const [result] = await db.query(sql, values);
      
      // Also create a notification for the homeowner
      const [job] = await db.query("SELECT homeownerId, title FROM jobs WHERE id = ?", [job_id]);
      if (job.length > 0) {
        const homeownerId = job[0].homeownerId;
        const [worker] = await db.query("SELECT fullName FROM users WHERE UserID = ?", [worker_id]);
        const workerName = worker.length > 0 ? worker[0].fullName : "A worker";
        
        await db.query(
          "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
          [homeownerId, 'bid', 'New Bid Received', `${workerName} placed a bid of RS ${amount} on your job: ${job[0].title}`]
        );
      }
      
      res.status(200).json({ message: "Bid placed successfully!", bidId: result.insertId });
    } catch (error) {
      console.error("Database error while placing bid:", error);
      res.status(500).json({ error: "Failed to place bid." });
    }
  });

  // --- GET BIDS FOR A JOB (For Homeowner) ---
  app.get('/api/bids/job/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      const sql = `
        SELECT b.*, u.fullName as worker_name, u.email as worker_email 
        FROM bids b 
        JOIN users u ON b.worker_id = u.UserID 
        WHERE b.job_id = ? 
        ORDER BY b.created_at DESC
      `;
      const [results] = await db.query(sql, [jobId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching bids for job:", error);
      res.status(500).json({ error: "Failed to fetch bids." });
    }
  });

  // --- GET BIDS FOR A WORKER (For Worker Dashboard) ---
  app.get('/api/bids/worker/:workerId', async (req, res) => {
    try {
      const { workerId } = req.params;
      const sql = `
        SELECT b.*, j.title as job_title 
        FROM bids b 
        JOIN jobs j ON b.job_id = j.id 
        WHERE b.worker_id = ? 
        ORDER BY b.created_at DESC
      `;
      const [results] = await db.query(sql, [workerId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching worker bids:", error);
      res.status(500).json({ error: "Failed to fetch bids." });
    }
  });

  // --- GET ALL BIDS FOR A HOMEOWNER'S JOBS ---
  app.get('/api/bids/homeowner/:homeownerId', async (req, res) => {
    try {
      const { homeownerId } = req.params;
      const sql = `
        SELECT b.*, j.title as job_title, u.fullName as worker_name, u.email as worker_email 
        FROM bids b 
        JOIN jobs j ON b.job_id = j.id 
        JOIN users u ON b.worker_id = u.UserID 
        WHERE j.homeownerId = ? 
        ORDER BY b.created_at DESC
      `;
      const [results] = await db.query(sql, [homeownerId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching homeowner bids:", error);
      res.status(500).json({ error: "Failed to fetch homeowner bids." });
    }
  });

  // --- UPDATE BID STATUS ---
  app.put('/api/bids/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'accepted' or 'rejected'
      
      await db.query("UPDATE bids SET status = ? WHERE id = ?", [status, id]);
      
      // If accepted, update other bids to rejected and job to in_progress
      if (status === 'accepted') {
        const [bidInfo] = await db.query("SELECT job_id, worker_id, amount FROM bids WHERE id = ?", [id]);
        if (bidInfo.length > 0) {
          const { job_id, worker_id, amount } = bidInfo[0];
          await db.query("UPDATE bids SET status = 'rejected' WHERE job_id = ? AND id != ?", [job_id, id]);
          await db.query("UPDATE jobs SET status = 'in_progress' WHERE id = ?", [job_id]);
          
          // Also create a notification for the worker
          const [job] = await db.query("SELECT title FROM jobs WHERE id = ?", [job_id]);
          if (job.length > 0) {
            await db.query(
              "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
              [worker_id, 'bid', 'Bid Accepted!', `Your bid of RS ${amount} for "${job[0].title}" was accepted!`]
            );
          }
        }
      }
      
      res.status(200).json({ message: "Bid status updated successfully!" });
    } catch (error) {
      console.error("Error updating bid status:", error);
      res.status(500).json({ error: "Failed to update bid status." });
    }
  });
};
