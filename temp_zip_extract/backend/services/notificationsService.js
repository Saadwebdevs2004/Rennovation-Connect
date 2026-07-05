const db = require('../config/database');

class NotificationsService {
  async getNotifications(userId) {
    const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20";
    const [results] = await db.query(sql, [userId]);
    return results;
  }

  async markAsRead(id) {
    await db.query("UPDATE notifications SET is_read = true WHERE id = ?", [id]);
    return { message: "Notification marked as read." };
  }

  async markAllAsRead(userId) {
    await db.query("UPDATE notifications SET is_read = true WHERE user_id = ?", [userId]);
    return { message: "All notifications marked as read." };
  }
}

module.exports = new NotificationsService();
