require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Kết nối PostgreSQL qua DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware để parse JSON
app.use(express.json());

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('🚀 EMR Backend is running!');
});

// Route lấy danh sách bệnh nhân
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Lỗi truy vấn:', err);
    res.status(500).json({ error: 'Lỗi server khi truy vấn bệnh nhân' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`✅ Server is listening on port ${port}`);
});
