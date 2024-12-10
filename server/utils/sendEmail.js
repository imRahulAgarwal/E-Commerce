import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ to, subject, text }) => {
    let transporter;

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        // Create Ethereal test account transporter in development
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        // Configure Gmail transporter for production
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    // Define email options
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
};

export default sendEmail;
