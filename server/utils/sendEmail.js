import nodemailer from "nodemailer";
import path from "path";
import __dirname from "../dirname.js";
import fs from "fs";

const sendEmail = async ({ to, subject, name, link }) => {
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

    const emailTemplate = path.join(__dirname, "utils", "email-template.html");
    const emailHtml = fs.readFileSync(emailTemplate, "utf8");
    const emailContent = emailHtml.replace("https://example.com/reset-password", link).replace("username", name);

    // Define email options
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html: emailContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
};

export default sendEmail;
