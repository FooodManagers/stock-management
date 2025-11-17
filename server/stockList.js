
const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};


async function getItems() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM stock');
    return rows;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { getItems };