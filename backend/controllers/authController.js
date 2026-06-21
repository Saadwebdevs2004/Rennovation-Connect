const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { fullName, email, password, userRole } = req.body;
      const result = await authService.registerUser(fullName, email, password, userRole);
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(error.status || 500).json({ error: error.message || 'Server error during registration.' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error) {
      console.error('Login Error:', error);
      res.status(error.status || 500).json({ error: error.message || 'An error occurred during login.' });
    }
  }
}

module.exports = new AuthController();
