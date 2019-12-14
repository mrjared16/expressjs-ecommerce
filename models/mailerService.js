const mailer = require('nodemailer')
require('dotenv').config();

exports.transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USERNAME_GMAIL,
        pass: process.env.PASSWORD_GMAIL
    }
});
