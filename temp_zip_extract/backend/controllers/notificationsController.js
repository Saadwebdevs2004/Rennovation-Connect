const notificationsService = require('../services/notificationsService');

class NotificationsController {
  async getNotifications(req, res) {
    try {
      const { userId } = req.params;
      const results = await notificationsService.getNotifications(userId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications." });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const result = await notificationsService.markAsRead(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Failed to update notification." });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;
      const result = await notificationsService.markAllAsRead(userId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating notifications:", error);
      res.status(500).json({ error: "Failed to update notifications." });
    }
  }
}

module.exports = new NotificationsController();
