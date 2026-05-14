const db = require('./db');
async function run() {
  const [rows] = await db.query('DESCRIBE jobs');
  console.log(rows);
  process.exit();
}
run();
