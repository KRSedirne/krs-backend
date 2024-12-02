import nodemailer from "nodemailer";
import dotenv from "dotenv";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "./errorHandler.js";

dotenv.config();

const sendMail = catchAsyncErrors(async (to, subject, htmlContent) => {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },

    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        return next(new ErrorHandler("Email couldn't send", 500));
    };
});

export default sendMail;