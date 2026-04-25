module.exports = function (app, db) {
  // --- SEND A MESSAGE ---
  app.post('/api/messages', async (req, res) => {
    try {
      const { senderId, receiverId, jobId, message, sender_id, receiver_id, job_id, content } = req.body;
      
      const final_sender_id = senderId || sender_id;
      const final_receiver_id = receiverId || receiver_id;
      const final_job_id = jobId || job_id || null;
      const final_content = message || content;

      const sql = "INSERT INTO messages (sender_id, receiver_id, job_id, content) VALUES (?, ?, ?, ?)";
      const values = [final_sender_id, final_receiver_id, final_job_id, final_content];

      const [result] = await db.query(sql, values);

      // Also create a notification for the receiver
      const [sender] = await db.query("SELECT fullName FROM users WHERE UserID = ?", [final_sender_id]);
      const senderName = sender.length > 0 ? sender[0].fullName : "Someone";

      await db.query(
        "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
        [final_receiver_id, 'message', 'New Message', `You received a new message from ${senderName}`]
      );

      res.status(200).json({ message: "Message sent successfully!", messageId: result.insertId });
    } catch (error) {
      console.error("Database error while sending message:", error);
      res.status(500).json({ error: "Failed to send message." });
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
          MAX(m.created_at) as last_message_time,
          (SELECT content FROM messages 
           WHERE (sender_id = ? AND receiver_id = u.UserID) 
              OR (sender_id = u.UserID AND receiver_id = ?) 
           ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT job_id FROM messages 
           WHERE (sender_id = ? AND receiver_id = u.UserID) 
              OR (sender_id = u.UserID AND receiver_id = ?) 
           ORDER BY created_at DESC LIMIT 1) as job_id,
          (SELECT COUNT(*) FROM messages 
           WHERE receiver_id = ? AND sender_id = u.UserID AND is_read = false) as unread_count
        FROM (
          SELECT receiver_id as contact_id, created_at FROM messages WHERE sender_id = ?
          UNION ALL
          SELECT sender_id as contact_id, created_at FROM messages WHERE receiver_id = ?
        ) m
        JOIN users u ON m.contact_id = u.UserID
        GROUP BY u.UserID, u.fullName
        ORDER BY last_message_time DESC
      `;
      const [results] = await db.query(sql, [userId, userId, userId, userId, userId, userId, userId]);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations." });
    }
  });

  // --- MARK MESSAGES AS READ ---
  app.put('/api/messages/read/:userId/:otherUserId', async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      const sql = "UPDATE messages SET is_read = true WHERE receiver_id = ? AND sender_id = ? AND is_read = false";
      await db.query(sql, [userId, otherUserId]);
      res.status(200).json({ message: "Messages marked as read." });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Failed to mark messages as read." });
    }
  });

  // --- GET CHAT HISTORY BETWEEN TWO USERS ---
  app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      const sql = `
        SELECT m.*, m.content as message, u1.fullName as sender_name, u2.fullName as receiver_name 
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
};
