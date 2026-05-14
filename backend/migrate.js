const db = require('./db');

async function migrate() {
  console.log("Running migrations...");
  try {
    // Check if progress_status exists
    const [jobsCols] = await db.query("SHOW COLUMNS FROM jobs LIKE 'progress_status'");
    if (jobsCols.length === 0) {
      await db.query("ALTER TABLE jobs ADD COLUMN progress_status VARCHAR(50) DEFAULT 'Started'");
      console.log("Added progress_status to jobs");
    }

    // Check if is_disputed exists
    const [reviewsCols] = await db.query("SHOW COLUMNS FROM reviews LIKE 'is_disputed'");
    if (reviewsCols.length === 0) {
      await db.query("ALTER TABLE reviews ADD COLUMN is_disputed BOOLEAN DEFAULT false");
      console.log("Added is_disputed to reviews");
    }

    console.log("Migrations complete.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

migrate();
