const db = require('./db');

async function migrate() {
  console.log("Running image migrations...");
  try {
    const [jobsCols] = await db.query("SHOW COLUMNS FROM jobs LIKE 'completion_image_url'");
    if (jobsCols.length === 0) {
      await db.query("ALTER TABLE jobs ADD COLUMN completion_image_url LONGTEXT");
      console.log("Added completion_image_url to jobs");
    }

    const [paymentsCols] = await db.query("SHOW COLUMNS FROM payments LIKE 'receipt_image_url'");
    if (paymentsCols.length === 0) {
      await db.query("ALTER TABLE payments ADD COLUMN receipt_image_url LONGTEXT");
      console.log("Added receipt_image_url to payments");
    }

    console.log("Migrations complete.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

migrate();
