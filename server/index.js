const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const Invoice = require('./Invoice.js')
const app = express();
const port = 8000;
const Retrieve = require('./Retrieve.js')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password:'Niya@2912',

});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Not connected:', err);
  } else {
    console.log('Connected to db');
    connection.release();
  }
});
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: "nidunnidun9@gmail.com",
    pass: "fwxydsvmmokzjoxe",
  },
});
app.use(cors());
app.use(bodyParser.json());
const balances = [
  { accountName: 'Main Account', amount: 5000 },
  { accountName: 'Savings Account', amount: 3000 },
];

const transactions = [
  { date: '2023-06-20', description: 'Invoice Payment', amount: 2000, account: { accountName: 'Main Account', accountNumber: '12345', balance: 5000, transactions: [] } },
  { date: '2023-06-21', description: 'Purchase', amount: -500, account: { accountName: 'Savings Account', accountNumber: '67890', balance: 3000, transactions: [] } },
];
app.get('/api/balances', (req, res) => {
  res.json(balances);
});
app.use('/Invoice',Invoice);
app.use('/Retrieve',Retrieve);

app.post('/api/Auth', (req, res) => {
  const { username, password } = req.body;
  pool.query(
    'SELECT * FROM admin WHERE username = ? AND password = ?', [username, password],
    (error, results) => {
      if (error) {
        console.log('Error verifying the admin:', error);
        res.status(200).send('Internal server error');
      } else if (results.length > 0) {
        console.log('Admin verified successfully');
        res.status(200).send('Successful');
      } else {
        console.log('Unverified');
        res.status(200).send('Unauthorized');
      }
    }
  );
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/clients', (req, res) => {
  const { name, company, Des, Quote } = req.body;
  pool.query(
    'INSERT INTO clients (name, company, Des, Quote) VALUES (?, ?, ?, ?)',
    [name, company, Des, Quote],
    (err, results) => {
      if (err) {
        console.error('Error saving client details:', err);
        res.status(500).send('Error saving client details');
      } else {
        console.log('Client details saved successfully');
        res.status(200).send('Client details saved successfully');
      }
    }
  );
});
app.get('/api/fetchclient',(req,res)=>{
  pool.query('Selectname, company, Des, Quote from clients where status = 1 ')
})

app.get('/api/client', (req, res) => {
  pool.query('SELECT name, company, Des, Quote, Status FROM clients', (err, results) => {
    if (err) {
      console.error('Error fetching client details:', err);
      res.status(200).send('Error fetching client details');
    } else {
      console.log('Client details fetched successfully');
      res.status(200).json(results);
    }
  });
});

app.post('/api/alter', (req, res) => {
  const { name, status } = req.body;
  pool.query(
    'UPDATE clients SET Status = ? WHERE name = ?',
    [status, name],
    (err, results) => {
      if (err) {
        console.error('Error updating client status:', err);
        res.status(200).send('Error updating client status');
      } else {
        console.log('Client status updated successfully');
        res.status(200).send('Client status updated successfully');
      }
    }
  );
});
app.post('/api/empdetails',(req,res)=>{
  const {name, email, phone, position, department, joiningDate, address} = req.body;
  pool.query('insert into emp (name, email, phone, position, department, joining_date, address) values (?,?,?,?,?,?,?)',
    [name, email, phone, position, department, joiningDate, address],(err,results)=>{
      if(err){
        console.log('error updating details',err);
        res.status(200).send('cannot send employee details')
      }
      else{9
        console.log('values entered succesfuuly');
        res.status(200).send('Employee details entered');
      }
    }
  )
})
app.get('/api/getemp',(req,res)=>{
  pool.query('select name , email from emp;',(err,results)=>{
    if(err){
      console.log('cannot fetch emp details');
      res.status(200).send('cant fetch emp details');
    }
    else{
      console.log('emp details fetched');
      res.status(220).json(results.length ? results : []);
    }
  })
})
app.get('/api/mail', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: 'albedonidun@gmail.com',
      to: "keethu171003@gmail.com",
      subject: "Hey Fish Tank",
      text: "Test mail from nid",
    });
    console.log("Message sent: %s", info.messageId);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send('Error sending email');
  }
});
app.get('/api/GetCustomer',(req,res)=>{
  pool.query('select * from clients ;',(err,results)=>{
    if(err){
      console.log('cannot fetch emp details');
      res.status(200).send('cant fetch emp details');
    }
    else{
      console.log('pending emp details fetched');
      res.status(220).json(results);
    }
  })
})
app.get('/api/GetPending',(req,res)=>{
  pool.query('select * from clients where status = 0;',(err,results)=>{
    if(err){
      console.log('cannot fetch emp details');
      res.status(200).send('cant fetch emp details');
    }
    else{
      console.log('pending emp details fetched');
      res.status(220).json(results);
    }
  })
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
