const nodemailer = require('nodemailer');

const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    port: process.env.EMAIL_PORT,
    secure: false,
    from: process.env.EMAIL
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