const express = require('express');
const multer = require('multer');
const mysql2 = require('mysql2')

const pool = mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'user'
})
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Not connected:', err);
  } else {
    console.log('Connected');
    connection.release();
  }
});
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});