const nodemailer = require('nodemailer');

const mail = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    requireTls: true,
    // secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const emailHandler = async (
    email: String,
    token: String
) => {
    const mailOptions = {
        from: '"Weekly Team" <myyweeklyy@gmail.com>',
        to: email,
        subject: 'Reset Password Token - Weekly.com',
        html: `<p>You requested for a password reset! Kindly use this token to reset your password: <p> ${token} </p></p>`
    };

    return await mail.sendMail(mailOptions)
        .then(() => {
            return 1
        })
        .catch((err: Error) => {
            return 0
        })
};