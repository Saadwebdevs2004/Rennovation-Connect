const usersService = require('../services/usersService');

class UsersController {
  async getWorkerProfile(req, res) {
    try {
      const { id } = req.params;
      const result = await usersService.getWorkerProfile(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching worker profile:", error);
      res.status(error.status || 500).json({ error: error.message || "Failed to fetch worker profile" });
    }
  }

  async getUserProfile(req, res) {
    try {
      const { id } = req.params;
      const result = await usersService.getUserProfile(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(error.status || 500).json({ error: error.message || "Failed to fetch user profile" });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { id } = req.params;
      const { fullName, phone, address, bio, city, state, zipCode, avatar, skills } = req.body;
      const result = await usersService.updateUserProfile(id, {
        fullName,
        phone,
        address,
        bio,
        city,
        state,
        zipCode,
        avatar,
        skills
      });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const results = await usersService.getAllUsers();
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching users list:", error);
      res.status(500).json({ error: "Failed to fetch users list" });
    }
  }
}

module.exports = new UsersController();
