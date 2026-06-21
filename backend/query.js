const db = require('./config/database');
async function run() {
  const [rows] = await db.query('DESCRIBE jobs');
  console.log(rows);
  process.exit();
}
run();
