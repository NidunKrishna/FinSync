const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const router = express.Router()
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    user:'root',
    host :'localhost',
    password:'Niya@2912',
    // database:'user',
})
db.getConnection((err,connection)=>{
    if(err){
        console.log(err,'not connected db for invoice');
    }
    console.log('connected db for Invoice');
})

app.use(cors());
app.use(bodyParser.json());

router.post('/', (req, res) => {
    const { invoiceNumber, issueDate, contactName, email, reference, description, dueDate, deliveryDate, billingFrom, country, currency } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'keethu171003@gmail.com',
            pass: 'hbjs cqlq upid rypi'

        }
    });

    const mailOptions = {
       
        from: 'keethu171003@gmail.com',
        to: email,
        subject: 'Invoice Details',
        text: `
            Invoice No: ${invoiceNumber}
            Issue Date: ${issueDate}
            Contact Name: ${contactName}
            Email: ${email}
            Reference: ${reference}
            Description: ${description}
            Due Date: ${dueDate}
            Delivery Date: ${deliveryDate}
            Billing From: ${billingFrom}
            Country: ${country}
            Currency: ${currency}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            let errorMessage = 'Error sending email:';
            if (error.response) {
                errorMessage += ` ${error.response}`;
            } else if (error.message) {
                errorMessage += ` ${error.message}`;
            }
            console.error(errorMessage);
            res.status(500).json({ message: 'Error: Failed to send email', error: errorMessage });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' ,error });
        }
    });
});

module.exports = router;