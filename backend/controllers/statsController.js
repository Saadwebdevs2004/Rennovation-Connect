const statsService = require('../services/statsService');

class StatsController {
  async getHomeownerStats(req, res) {
    try {
      const { id } = req.params;
      const result = await statsService.getHomeownerStats(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching homeowner stats:", error);
      res.status(500).json({ error: "Failed to fetch stats." });
    }
  }

  async getWorkerStats(req, res) {
    try {
      const { id } = req.params;
      const result = await statsService.getWorkerStats(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching worker stats:", error);
      res.status(500).json({ error: "Failed to fetch stats." });
    }
  }

  async getHomeownerPayments(req, res) {
    try {
      const { id } = req.params;
      const results = await statsService.getHomeownerPayments(id);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching homeowner payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  }

  async getWorkerPayments(req, res) {
    try {
      const { id } = req.params;
      const results = await statsService.getWorkerPayments(id);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching worker payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  }

  async getAdminStats(req, res) {
    try {
      const result = await statsService.getAdminStats();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats." });
    }
  }
}

module.exports = new StatsController();
