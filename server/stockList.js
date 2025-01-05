
const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kys008mysqlroot',
  database: 'stockmanagementdb',
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