const mailer = require('nodemailer')
require('dotenv').config();

exports.transporter = mailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USERNAME_YANDEX,
        pass: process.env.PASSWORD_YANDEX
    }
});
