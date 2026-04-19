module.exports = function(app, db) {
  // --- GET USER PROFILE ---
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "SELECT UserID, FullName, Email, Role, Phone, Address, Bio, City, State, ZipCode, Avatar FROM Users WHERE UserID = ?";
      const [results] = await db.query(sql, [id]);
      
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // --- UPDATE USER PROFILE ---
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, phone, address, bio, city, state, zipCode, avatar } = req.body;
      
      const sql = `
        UPDATE Users 
        SET FullName = ?, Phone = ?, Address = ?, Bio = ?, City = ?, State = ?, ZipCode = ?, Avatar = ?
        WHERE UserID = ?
      `;
      const values = [fullName, phone, address, bio, city, state, zipCode, avatar, id];
      
      await db.query(sql, values);
      res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });
};
