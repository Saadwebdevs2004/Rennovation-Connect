const db = require('../config/database');

class PaymentsService {
  async createPayment({ job_id, homeowner_id, worker_id, amount, method, status, receipt_image_url }) {
    const sql = "INSERT INTO payments (job_id, homeowner_id, worker_id, amount, method, status, receipt_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [job_id, homeowner_id, worker_id, amount, method, status, receipt_image_url || null];
    const [result] = await db.query(sql, values);

    if (status === 'pending_approval') {
      const [job] = await db.query("SELECT title FROM jobs WHERE id = ?", [job_id]);
      if (job.length > 0) {
        await db.query(
          "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
          [worker_id, 'payment', 'Receipt Uploaded', `Homeowner uploaded a receipt for RS ${amount} on job: ${job[0].title}. Please verify.`]
        );
      }
    }
    return { message: "Payment recorded successfully!", paymentId: result.insertId };
  }

  async getPendingPayments(workerId) {
    const sql = `
      SELECT p.*, j.title as job_title, u.fullName as homeowner_name
      FROM payments p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u ON p.homeowner_id = u.UserID
      WHERE p.worker_id = ? AND p.status = 'pending_approval'
      ORDER BY p.created_at DESC
    `;
    const [results] = await db.query(sql, [workerId]);
    return results;
  }

  async approvePayment(id) {
    await db.query("UPDATE payments SET status = 'completed' WHERE id = ?", [id]);

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
    return { message: "Payment approved successfully!" };
  }

  async getAllPayments() {
    const sql = `
      SELECT p.*, j.title as job_title, h.fullName as homeowner_name, w.fullName as worker_name
      FROM payments p
      JOIN jobs j ON p.job_id = j.id
      JOIN users h ON p.homeowner_id = h.UserID
      JOIN users w ON p.worker_id = w.UserID
      ORDER BY p.created_at DESC
    `;
    const [results] = await db.query(sql);
    return results;
  }
}

module.exports = new PaymentsService();
