const db = require('../config/database');

class UsersService {
  async getWorkerProfile(id) {
    const sql = "SELECT UserID as id, FullName as fullName, Email as email, Role as role, Phone as phone, Address as address, Bio as bio, City as city, State as state, ZipCode as zipCode, Avatar as avatar, Skills as skills FROM Users WHERE UserID = ?";
    const [results] = await db.query(sql, [id]);

    if (results.length === 0) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const profile = results[0];
    profile.skills = profile.skills || "Plumbing, Electrical, Carpentry";
    profile.certifications = "Identity Verified";
    return profile;
  }

  async getUserProfile(id) {
    const sql = "SELECT UserID, FullName, Email, Role, Phone, Address, Bio, City, State, ZipCode, Avatar, Skills FROM Users WHERE UserID = ?";
    const [results] = await db.query(sql, [id]);

    if (results.length === 0) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    return results[0];
  }

  async updateUserProfile(id, { fullName, phone, address, bio, city, state, zipCode, avatar, skills }) {
    const sql = `
      UPDATE Users 
      SET FullName = ?, Phone = ?, Address = ?, Bio = ?, City = ?, State = ?, ZipCode = ?, Avatar = ?, Skills = ?
      WHERE UserID = ?
    `;
    const values = [fullName, phone, address, bio, city, state, zipCode, avatar, skills, id];
    await db.query(sql, values);
    return { message: "Profile updated successfully!" };
  }

  async getAllUsers() {
    const sql = "SELECT UserID, FullName, Email, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC";
    const [results] = await db.query(sql);
    return results;
  }
}

module.exports = new UsersService();
