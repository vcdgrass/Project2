const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares cơ bản
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Phân tích body chuẩn JSON

// API Test Ping server
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'Badminton Booking API is running!' });
});

// Port chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
  


const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:vcdgk37@localhost:5432/Project2"
});

client.connect()
  .then(() => {
    console.log("✅ Kết nối thành công tới PostgreSQL!");
    return client.query("SELECT NOW()");
  })
  .then(res => {
    console.log("Thời gian từ server:", res.rows[0]);
  })
  .catch(err => {
    console.error("❌ Lỗi kết nối:", err);
  })
  .finally(() => {
    client.end();
  });