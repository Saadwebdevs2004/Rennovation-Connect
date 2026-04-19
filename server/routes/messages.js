module.exports = function(app, db) {
  // --- SEND A MESSAGE ---
  app.post('/api/messages', async (req, res) => {
    try {
      const { sender_id, receiver_id, job_id, content } = req.body;
      const sql = "INSERT INTO messages (sender_id, receiver_id, job_id, content) VALUES (?, ?, ?, ?)";
      const values = [sender_id, receiver_id, job_id || null, content];
      
      const [result] = await db.query(sql, values);
      
      // Also create a notification for the receiver
      const [sender] = await db.query("SELECT fullName FROM users WHERE UserID = ?", [sender_id]);
      const senderName = sender.length > 0 ? sender[0].fullName : "Someone";
      
      await db.query(
        "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
        [receiver_id, 'message', 'New Message', `You received a new message from ${senderName}`]
      );
      
      res.status(200).json({ message: "Message sent successfully!", messageId: result.insertId });
    } catch (error) {
      console.error("Database error while sending message:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  });

  // --- GET CHAT HISTORY BETWEEN TWO USERS ---
  app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      const sql = `
        SELECT m.*, u1.fullName as sender_name, u2.fullName as receiver_name 
        FROM messages m 
        JOIN users u1 ON m.sender_id = u1.UserID 
        JOIN users u2 ON m.receiver_id = u2.UserID 
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `;
      const [results] = await db.query(sql, [userId, otherUserId, otherUserId, userId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  });

  // --- GET CONVERSATIONS LIST FOR A USER ---
  app.get('/api/messages/conversations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const sql = `
        SELECT 
          u.UserID as contact_id, 
          u.fullName as contact_name, 
          MAX(m.created_at) as last_message_time
        FROM messages m
        JOIN users u ON (m.sender_id = u.UserID OR m.receiver_id = u.UserID)
        WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.UserID != ?
        GROUP BY u.UserID, u.fullName
        ORDER BY last_message_time DESC
      `;
      const [results] = await db.query(sql, [userId, userId, userId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations." });
    }
  });
};
