const jobsService = require('../services/jobsService');

class JobsController {
  async createJob(req, res) {
    try {
      const { homeownerId, title, category, description, location, budgetMin, budgetMax, urgency } = req.body;
      const result = await jobsService.createJob(homeownerId, title, category, description, location, budgetMin, budgetMax, urgency);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error while posting job:", error);
      res.status(500).json({ error: "Failed to save job to the database." });
    }
  }

  async getHomeownerJobs(req, res) {
    try {
      const homeownerId = req.params.id;
      const results = await jobsService.getHomeownerJobs(homeownerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching homeowner jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  }

  async getAllJobs(req, res) {
    try {
      const { workerId } = req.query;
      const results = await jobsService.getAllJobs(workerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  }

  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const result = await jobsService.getJobById(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching job details:", error);
      res.status(error.status || 500).json({ error: error.message || "Failed to fetch job" });
    }
  }

  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const { title, category, description, location, budgetMin, budgetMax } = req.body;
      const result = await jobsService.updateJob(id, title, category, description, location, budgetMin, budgetMax);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating job details:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  }

  async updateJobStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await jobsService.updateJobStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating job status:", error);
      res.status(500).json({ error: "Failed to update job status" });
    }
  }

  async updateJobProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress_status, completion_image_url } = req.body;
      const result = await jobsService.updateJobProgress(id, progress_status, completion_image_url);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating job progress:", error);
      res.status(500).json({ error: "Failed to update job progress" });
    }
  }
}

module.exports = new JobsController();
