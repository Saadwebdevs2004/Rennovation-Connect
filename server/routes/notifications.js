module.exports = function (app, db) {
  // --- GET NOTIFICATIONS ---
  app.get('/api/notifications/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20";
      const [results] = await db.query(sql, [userId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications." });
    }
  });

  // --- MARK NOTIFICATION AS READ ---
  app.put('/api/notifications/:id/read', async (req, res) => {
    try {
      const { id } = req.params;
      await db.query("UPDATE notifications SET is_read = true WHERE id = ?", [id]);
      res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Failed to update notification." });
    }
  });

  // --- MARK ALL NOTIFICATIONS AS READ ---
  app.put('/api/notifications/user/:userId/read-all', async (req, res) => {
    try {
      const { userId } = req.params;
      await db.query("UPDATE notifications SET is_read = true WHERE user_id = ?", [userId]);
      res.status(200).json({ message: "All notifications marked as read." });
    } catch (error) {
      console.error("Error updating notifications:", error);
      res.status(500).json({ error: "Failed to update notifications." });
    }
  });
};
