const db = require('../config/database');

class JobsService {
  async createJob(homeownerId, title, category, description, location, budgetMin, budgetMax, urgency) {
    const sql = "INSERT INTO jobs (homeownerId, title, category, description, location, budgetMin, budgetMax, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [homeownerId, title, category, description, location, budgetMin, budgetMax, urgency];
    const [result] = await db.query(sql, values);
    return { message: "Job posted successfully!", jobId: result.insertId };
  }

  async getHomeownerJobs(homeownerId) {
    const sql = `
      SELECT j.*, 
             (SELECT COUNT(*) FROM bids b WHERE b.job_id = j.id) as bidsCount,
             EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid,
             EXISTS(SELECT 1 FROM reviews r WHERE r.job_id = j.id AND r.reviewer_id = j.homeownerId) as hasReviewed
      FROM jobs j 
      WHERE j.homeownerId = ? 
      ORDER BY j.created_at DESC
    `;
    const [results] = await db.query(sql, [homeownerId]);
    return results;
  }

  async getAllJobs(workerId) {
    const sql = "SELECT * FROM jobs WHERE status = 'open' ORDER BY created_at DESC";
    let [results] = await db.query(sql);

    if (workerId) {
      const [bids] = await db.query("SELECT job_id FROM bids WHERE worker_id = ?", [workerId]);
      const biddedJobIds = new Set(bids.map(b => b.job_id));
      results = results.map(job => ({
        ...job,
        hasBidded: biddedJobIds.has(job.id)
      }));
    }
    return results;
  }

  async getJobById(id) {
    const sql = `
      SELECT j.*, b.worker_id as workerId,
             EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid,
             EXISTS(SELECT 1 FROM reviews r WHERE r.job_id = j.id AND r.reviewer_id = j.homeownerId) as hasReviewed
      FROM jobs j 
      LEFT JOIN bids b ON j.id = b.job_id AND b.status = 'accepted'
      WHERE j.id = ?
    `;
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) {
      const err = new Error("Job not found");
      err.status = 404;
      throw err;
    }
    return results[0];
  }

  async updateJob(id, title, category, description, location, budgetMin, budgetMax) {
    const sql = "UPDATE jobs SET title = ?, category = ?, description = ?, location = ?, budgetMin = ?, budgetMax = ? WHERE id = ?";
    const values = [title, category, description, location, budgetMin, budgetMax, id];
    await db.query(sql, values);
    return { message: "Job updated successfully!" };
  }

  async updateJobStatus(id, status) {
    await db.query("UPDATE jobs SET status = ? WHERE id = ?", [status, id]);

    // Let's notify the homeowner if marked as completed
    if (status === 'completed') {
      const [job] = await db.query("SELECT title, homeownerId FROM jobs WHERE id = ?", [id]);
      if (job.length > 0) {
        await db.query(
          "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
          [job[0].homeownerId, 'job', 'Project Completed', `Your project "${job[0].title}" has been marked as complete!`]
        );
      }
    }
    return { message: "Job status updated successfully!" };
  }

  async updateJobProgress(id, progress_status, completion_image_url) {
    if (completion_image_url) {
      await db.query("UPDATE jobs SET progress_status = ?, completion_image_url = ? WHERE id = ?", [progress_status, completion_image_url, id]);
    } else {
      await db.query("UPDATE jobs SET progress_status = ? WHERE id = ?", [progress_status, id]);
    }
    return { message: "Job progress updated successfully!" };
  }
}

module.exports = new JobsService();
