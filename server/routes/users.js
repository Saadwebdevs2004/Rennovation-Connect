module.exports = function(app, db) {
  // --- GET WORKER PROFILE (Specialized) ---
  app.get('/api/worker/profile/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "SELECT UserID as id, FullName as fullName, Email as email, Role as role, Phone as phone, Address as address, Bio as bio, City as city, State as state, ZipCode as zipCode, Avatar as avatar, Skills as skills FROM Users WHERE UserID = ?";
      const [results] = await db.query(sql, [id]);
      
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const profile = results[0];
      // Use database skills if present, else fallback for demo
      profile.skills = profile.skills || "Plumbing, Electrical, Carpentry"; 
      profile.certifications = "Identity Verified"; 
      
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching worker profile:", error);
      res.status(500).json({ error: "Failed to fetch worker profile" });
    }
  });

  // --- GET USER PROFILE ---
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "SELECT UserID, FullName, Email, Role, Phone, Address, Bio, City, State, ZipCode, Avatar, Skills FROM Users WHERE UserID = ?";
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
      const { fullName, phone, address, bio, city, state, zipCode, avatar, skills } = req.body;
      
      const sql = `
        UPDATE Users 
        SET FullName = ?, Phone = ?, Address = ?, Bio = ?, City = ?, State = ?, ZipCode = ?, Avatar = ?, Skills = ?
        WHERE UserID = ?
      `;
      const values = [fullName, phone, address, bio, city, state, zipCode, avatar, skills, id];
      
      await db.query(sql, values);
      res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // --- ADMIN: GET ALL USERS ---
  app.get('/api/users', async (req, res) => {
    try {
      const sql = "SELECT UserID, FullName, Email, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC";
      const [results] = await db.query(sql);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching users list:", error);
      res.status(500).json({ error: "Failed to fetch users list" });
    }
  });
};
