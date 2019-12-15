// ---Require packages--- //
const util = require('util');
const mysql = require('mysql');

// ---Set database connection credentials--- //
const config = {
  connectionLimit: 100, //important
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: '240.102.0.76',
  port: 3306,
  user: 'root',
  password: 'mau776922van',
  database: 'Shellproof',
};

// ---Create a MySQL pool--- //
const pool = mysql.createPool(config);

// ---Ping database to check for common exception errors--- //
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) connection.release();
  return;
});

// ---Promisify for Node.js async/await.--- //
pool.query = util.promisify(pool.query);

// ---Export the pool--- //
module.exports = pool;
