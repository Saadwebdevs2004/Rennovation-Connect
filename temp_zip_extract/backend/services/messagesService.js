const db = require('../config/database');

class MessagesService {
  async sendMessage(senderId, receiverId, jobId, content) {
    const sql = "INSERT INTO messages (sender_id, receiver_id, job_id, content) VALUES (?, ?, ?, ?)";
    const values = [senderId, receiverId, jobId || null, content];
    const [result] = await db.query(sql, values);

    // Create a notification for the receiver
    const [sender] = await db.query("SELECT fullName FROM users WHERE UserID = ?", [senderId]);
    const senderName = sender.length > 0 ? sender[0].fullName : "Someone";

    await db.query(
      "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
      [receiverId, 'message', 'New Message', `You received a new message from ${senderName}`]
    );

    return { message: "Message sent successfully!", messageId: result.insertId };
  }

  async getConversations(userId) {
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
    return results;
  }

  async markAsRead(userId, otherUserId) {
    const sql = "UPDATE messages SET is_read = true WHERE receiver_id = ? AND sender_id = ? AND is_read = false";
    await db.query(sql, [userId, otherUserId]);
    return { message: "Messages marked as read." };
  }

  async getChatHistory(userId, otherUserId) {
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
    return results;
  }
}

module.exports = new MessagesService();
