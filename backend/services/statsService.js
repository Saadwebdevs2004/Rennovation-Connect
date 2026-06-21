const db = require('../config/database');

class StatsService {
  async getHomeownerStats(id) {
    const [activeJobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE homeownerId = ? AND status = 'open'", [id]);
    const [totalBids] = await db.query("SELECT COUNT(*) as count FROM bids b JOIN jobs j ON b.job_id = j.id WHERE j.homeownerId = ?", [id]);
    const [completedJobs] = await db.query("SELECT COUNT(*) as count FROM jobs WHERE homeownerId = ? AND status = 'completed'", [id]);
    const [totalSpent] = await db.query("SELECT SUM(amount) as total FROM payments WHERE homeowner_id = ? AND status = 'completed'", [id]);

    return {
      activeJobs: activeJobs[0].count,
      totalBids: totalBids[0].count,
      completedJobs: completedJobs[0].count,
      totalSpent: totalSpent[0].total || 0
    };
  }

  async getWorkerStats(id) {
    const [activeBids] = await db.query("SELECT COUNT(*) as count FROM bids WHERE worker_id = ? AND status = 'pending'", [id]);
    const [jobsWon] = await db.query("SELECT COUNT(*) as count FROM bids WHERE worker_id = ? AND status = 'accepted'", [id]);
    const [earnings] = await db.query("SELECT SUM(amount) as total FROM payments WHERE worker_id = ? AND status = 'completed'", [id]);
    const [rating] = await db.query("SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE reviewee_id = ?", [id]);

    return {
      activeBids: activeBids[0].count,
      jobsWon: jobsWon[0].count,
      earnings: earnings[0].total || 0,
      rating: Number(rating[0].avg || 0).toFixed(1),
      reviewCount: rating[0].count
    };
  }

  async getHomeownerPayments(id) {
    const sql = `
      SELECT p.*, j.title as job_title, u.fullName as worker_name
      FROM payments p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u ON p.worker_id = u.UserID
      WHERE p.homeowner_id = ?
      ORDER BY p.created_at DESC
    `;
    const [results] = await db.query(sql, [id]);
    return results;
  }

  async getWorkerPayments(id) {
    const sql = `
      SELECT p.*, j.title as job_title, u.fullName as homeowner_name
      FROM payments p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u ON p.homeowner_id = u.UserID
      WHERE p.worker_id = ?
      ORDER BY p.created_at DESC
    `;
    const [results] = await db.query(sql, [id]);
    return results;
  }

  async getAdminStats() {
    const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users");
    const [totalJobs] = await db.query("SELECT COUNT(*) as count FROM jobs");
    const [totalBids] = await db.query("SELECT COUNT(*) as count FROM bids");
    const [totalRevenue] = await db.query("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'");
    const [recentJobs] = await db.query("SELECT j.*, u.fullName as clientName FROM jobs j JOIN users u ON j.homeownerId = u.UserID ORDER BY created_at DESC LIMIT 5");

    return {
      totalUsers: totalUsers[0].count,
      totalJobs: totalJobs[0].count,
      totalBids: totalBids[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      recentJobs: recentJobs
    };
  }
}

module.exports = new StatsService();
