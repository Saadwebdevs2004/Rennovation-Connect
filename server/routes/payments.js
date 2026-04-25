module.exports = function(app, db) {
  // --- CREATE NEW PAYMENT ---
  app.post('/api/payments', async (req, res) => {
    try {
      console.log("POST /api/payments called with:", req.body);
      const { job_id, homeowner_id, worker_id, amount, method, status } = req.body;
      const sql = "INSERT INTO payments (job_id, homeowner_id, worker_id, amount, method, status) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [job_id, homeowner_id, worker_id, amount, method, status];
      
      const [result] = await db.query(sql, values);
      console.log("Payment recorded result:", result);
      
      // If manual transfer (pending_approval), notify worker
      if (status === 'pending_approval') {
        const [job] = await db.query("SELECT title FROM jobs WHERE id = ?", [job_id]);
        if (job.length > 0) {
          await db.query(
            "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
            [worker_id, 'payment', 'Receipt Uploaded', `Homeowner uploaded a receipt for RS ${amount} on job: ${job[0].title}. Please verify.`]
          );
        }
      }
      
      res.status(200).json({ message: "Payment recorded successfully!", paymentId: result.insertId });
    } catch (error) {
      console.error("Error recording payment:", error);
      res.status(500).json({ error: "Failed to record payment." });
    }
  });

  // --- GET PENDING PAYMENTS FOR A WORKER ---
  app.get('/api/payments/pending/:workerId', async (req, res) => {
    try {
      const { workerId } = req.params;
      const sql = `
        SELECT p.*, j.title as job_title, u.fullName as homeowner_name
        FROM payments p
        JOIN jobs j ON p.job_id = j.id
        JOIN users u ON p.homeowner_id = u.UserID
        WHERE p.worker_id = ? AND p.status = 'pending_approval'
        ORDER BY p.created_at DESC
      `;
      const [results] = await db.query(sql, [workerId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      res.status(500).json({ error: "Failed to fetch pending payments." });
    }
  });

  // --- APPROVE A MANUAL TRANSFER ---
  app.put('/api/payments/:id/approve', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Update status to completed
      await db.query("UPDATE payments SET status = 'completed' WHERE id = ?", [id]);
      
      // Notify Homeowner
      const [payment] = await db.query(`
        SELECT p.amount, p.homeowner_id, j.title as job_title
        FROM payments p JOIN jobs j ON p.job_id = j.id WHERE p.id = ?
      `, [id]);
      
      if (payment.length > 0) {
        await db.query(
          "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
          [payment[0].homeowner_id, 'payment', 'Payment Approved!', `Your payment of RS ${payment[0].amount} for "${payment[0].job_title}" was approved by the worker.`]
        );
      }
      
      res.status(200).json({ message: "Payment approved successfully!" });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ error: "Failed to approve payment." });
    }
  });

  // --- ADMIN: GET ALL PAYMENTS ---
  app.get('/api/payments', async (req, res) => {
    try {
      const sql = `
        SELECT p.*, j.title as job_title, h.fullName as homeowner_name, w.fullName as worker_name
        FROM payments p
        JOIN jobs j ON p.job_id = j.id
        JOIN users h ON p.homeowner_id = h.UserID
        JOIN users w ON p.worker_id = w.UserID
        ORDER BY p.created_at DESC
      `;
      const [results] = await db.query(sql);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  });
};
