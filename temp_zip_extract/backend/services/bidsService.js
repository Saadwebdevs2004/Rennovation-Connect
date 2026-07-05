const db = require('../config/database');

class BidsService {
  async createBid(job_id, worker_id, amount, proposal_text) {
    const sql = "INSERT INTO bids (job_id, worker_id, amount, proposal_text) VALUES (?, ?, ?, ?)";
    const values = [job_id, worker_id, amount, proposal_text];
    const [result] = await db.query(sql, values);

    // Create a notification for the homeowner
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

    return { message: "Bid placed successfully!", bidId: result.insertId };
  }

  async getBidsByJobId(jobId) {
    const sql = `
      SELECT b.*, u.fullName as worker_name, u.email as worker_email 
      FROM bids b 
      JOIN users u ON b.worker_id = u.UserID 
      WHERE b.job_id = ? 
      ORDER BY b.created_at DESC
    `;
    const [results] = await db.query(sql, [jobId]);
    return results;
  }

  async getBidsByWorkerId(workerId) {
    const sql = `
      SELECT b.*, j.title as job_title, j.status as job_status, j.progress_status as job_progress_status,
             EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid
      FROM bids b 
      JOIN jobs j ON b.job_id = j.id 
      WHERE b.worker_id = ? 
      ORDER BY b.created_at DESC
    `;
    const [results] = await db.query(sql, [workerId]);
    return results;
  }

  async getBidsByHomeownerId(homeownerId) {
    const sql = `
      SELECT b.*, j.title as job_title, j.status as job_status, 
             u.fullName as worker_name, u.email as worker_email,
             EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid
      FROM bids b 
      JOIN jobs j ON b.job_id = j.id 
      JOIN users u ON b.worker_id = u.UserID 
      WHERE j.homeownerId = ? 
      ORDER BY b.created_at DESC
    `;
    const [results] = await db.query(sql, [homeownerId]);
    return results;
  }

  async updateBidStatus(id, status) {
    await db.query("UPDATE bids SET status = ? WHERE id = ?", [status, id]);

    if (status === 'accepted') {
      const [bidInfo] = await db.query("SELECT job_id, worker_id, amount FROM bids WHERE id = ?", [id]);
      if (bidInfo.length > 0) {
        const { job_id, worker_id, amount } = bidInfo[0];
        await db.query("UPDATE bids SET status = 'rejected' WHERE job_id = ? AND id != ?", [job_id, id]);
        await db.query("UPDATE jobs SET status = 'in_progress' WHERE id = ?", [job_id]);

        // Create a notification for the worker
        const [job] = await db.query("SELECT title FROM jobs WHERE id = ?", [job_id]);
        if (job.length > 0) {
          await db.query(
            "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
            [worker_id, 'bid', 'Bid Accepted!', `Your bid of RS ${amount} for "${job[0].title}" was accepted!`]
          );
        }
      }
    }

    return { message: "Bid status updated successfully!" };
  }
}

module.exports = new BidsService();
