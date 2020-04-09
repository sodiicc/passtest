import nodemailer from 'nodemailer'
import config from '../../../config/server.json';

let sendmail = {};

sendmail.smtpTransport = nodemailer.createTransport({
    service: config.sendmail.transport.service,
    host: config.sendmail.transport.host,
    auth: {
        user: config.sendmail.transport.user,
        pass: config.sendmail.transport.pass
    }
});

sendmail.mailOptions={
    to :  config.sendmail.email,
    from: '"NodeJS Transport" <'+ config.sendmail.transport.address+'>',
};

module.exports = sendmail;
