const bidsService = require('../services/bidsService');

class BidsController {
  async createBid(req, res) {
    try {
      const { job_id, worker_id, amount, proposal_text } = req.body;
      const result = await bidsService.createBid(job_id, worker_id, amount, proposal_text);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error while placing bid:", error);
      res.status(500).json({ error: "Failed to place bid." });
    }
  }

  async getBidsByJobId(req, res) {
    try {
      const { jobId } = req.params;
      const results = await bidsService.getBidsByJobId(jobId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching bids for job:", error);
      res.status(500).json({ error: "Failed to fetch bids." });
    }
  }

  async getBidsByWorkerId(req, res) {
    try {
      const { workerId } = req.params;
      const results = await bidsService.getBidsByWorkerId(workerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching worker bids:", error);
      res.status(500).json({ error: "Failed to fetch bids." });
    }
  }

  async getBidsByHomeownerId(req, res) {
    try {
      const { homeownerId } = req.params;
      const results = await bidsService.getBidsByHomeownerId(homeownerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching homeowner bids:", error);
      res.status(500).json({ error: "Failed to fetch homeowner bids." });
    }
  }

  async updateBidStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await bidsService.updateBidStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating bid status:", error);
      res.status(500).json({ error: "Failed to update bid status." });
    }
  }
}

module.exports = new BidsController();
