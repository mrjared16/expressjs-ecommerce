const mailer = require('nodemailer')

exports.transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hoangvanphuc16@gmail.com',
        pass: 'kocanbit'
    }
});
