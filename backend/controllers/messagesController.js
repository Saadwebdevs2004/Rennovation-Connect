const messagesService = require('../services/messagesService');

class MessagesController {
  async sendMessage(req, res) {
    try {
      const { senderId, receiverId, jobId, message, sender_id, receiver_id, job_id, content } = req.body;

      const final_sender_id = senderId || sender_id;
      const final_receiver_id = receiverId || receiver_id;
      const final_job_id = jobId || job_id || null;
      const final_content = message || content;

      const result = await messagesService.sendMessage(final_sender_id, final_receiver_id, final_job_id, final_content);
      res.status(200).json(result);
    } catch (error) {
      console.error("Database error while sending message:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  }

  async getConversations(req, res) {
    try {
      const { userId } = req.params;
      const results = await messagesService.getConversations(userId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations." });
    }
  }

  async markAsRead(req, res) {
    try {
      const { userId, otherUserId } = req.params;
      const result = await messagesService.markAsRead(userId, otherUserId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Failed to mark messages as read." });
    }
  }

  async getChatHistory(req, res) {
    try {
      const { userId, otherUserId } = req.params;
      const results = await messagesService.getChatHistory(userId, otherUserId);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages." });
    }
  }
}

module.exports = new MessagesController();
