const mysql = require('mysql2/promise'); // access to mysql2 package 

const pool = mysql.createPool({ // create a connection with the database
  host: 'localhost',
  database: 'blog',
  user: 'root',
  password: '142536'
});

module.exports = pool;