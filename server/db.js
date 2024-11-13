// db.js
const mysql = require('mysql2');

// Buat koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // ganti dengan user database-mu
  password: '',      // ganti dengan password database-mu
  database: 'user_auth'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = db;
