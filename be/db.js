const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // tên user PostgreSQL
  host: 'localhost',      // host
  database: 'mydb',       // tên database
  password: 'yourpassword', // mật khẩu
  port: 5432,             // cổng mặc định
});

module.exports = pool;