import nodemailer from "nodemailer";
import dotenv from "dotenv";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "./errorHandler.js";
import globalConfig from "../configs/globalConfig.js";

dotenv.config();

const sendMail = catchAsyncErrors(async (to, subject, htmlContent) => {

    const transporter = nodemailer.createTransport({
        host: globalConfig.smtp.host,
        port: globalConfig.smtp.port,
        service: "Gmail",
        auth: {
            user: globalConfig.smtp.email,
            pass: globalConfig.smtp.password,
        },

    });

    const mailOptions = {
        from: `${globalConfig.smtp.fromName} <${globalConfig.smtp.fromEmail}>`,
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