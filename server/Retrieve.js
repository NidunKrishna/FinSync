const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const Invoice = require('./Invoice.js')
const router = express.Router()

router.use(cors());

const db = mysql.createPool({
host:'localhost',
user:'root',
password:'Niya@2912',
database:'user'
});

db.getConnection((err, connection) => {
    if (err) {
      console.error('Not connected:', err);
    } else {
      console.log('Connected for retrieve');
      connection.release();
    }
  }); 
  
 
  router.get('/',(req,res)=>{
    db.query('select * from clients',(err,results)=>{
      if(err){
        console.log('retrieved for employees');
        res.status(500).send('cant fetch emp details');
      }
      else{
        res.status(220).json(results);
        
      }
    })
  })

module.exports = router;
