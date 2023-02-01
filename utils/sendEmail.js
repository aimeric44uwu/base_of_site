const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD
            }
          });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;
