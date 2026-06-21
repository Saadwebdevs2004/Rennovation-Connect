const paymentsService = require('../services/paymentsService');

class PaymentsController {
  async createPayment(req, res) {
    try {
      const { job_id, homeowner_id, worker_id, amount, method, status, receipt_image_url } = req.body;
      const result = await paymentsService.createPayment({
        job_id,
        homeowner_id,
        worker_id,
        amount,
        method,
        status,
        receipt_image_url
      });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error recording payment:", error);
      res.status(500).json({ error: "Failed to record payment." });
    }
  }

  async getPendingPayments(req, res) {
    try {
      const { workerId } = req.params;
      const results = await paymentsService.getPendingPayments(workerId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      res.status(500).json({ error: "Failed to fetch pending payments." });
    }
  }

  async approvePayment(req, res) {
    try {
      const { id } = req.params;
      const result = await paymentsService.approvePayment(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ error: "Failed to approve payment." });
    }
  }

  async getAllPayments(req, res) {
    try {
      const results = await paymentsService.getAllPayments();
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  }
}

module.exports = new PaymentsController();
