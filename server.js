require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Kiểm tra biến môi trường
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1); // Dừng server nếu thiếu biến
}

// ✅ Kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Railway yêu cầu SSL
  },
});

// ✅ Test kết nối
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL');
    release();
  }
});

console.log('📦 DATABASE_URL:', process.env.DATABASE_URL);


app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Query error:', err.stack);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
