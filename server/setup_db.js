const db = require('./db');

async function createTables() {
  console.log("Setting up database tables...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS bids (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      worker_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      proposal_text TEXT,
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (worker_id) REFERENCES users(UserID) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      job_id INT,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(UserID) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(UserID) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      homeowner_id INT NOT NULL,
      worker_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'completed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (homeowner_id) REFERENCES users(UserID) ON DELETE CASCADE,
      FOREIGN KEY (worker_id) REFERENCES users(UserID) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(UserID) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      reviewer_id INT NOT NULL,
      reviewee_id INT NOT NULL,
      rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(UserID) ON DELETE CASCADE,
      FOREIGN KEY (reviewee_id) REFERENCES users(UserID) ON DELETE CASCADE
    )`
  ];

  try {
    for (const query of queries) {
      await db.query(query);
    }
    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit(0);
  }
}

createTables();
