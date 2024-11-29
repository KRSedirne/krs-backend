import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to,subject,htmlContent) =>{

    const transporter= nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
       
    });

    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:to,
        subject: subject,
        html: htmlContent,
    };
    
    try{
        const info = await transporter.sendMail(mailOptions);
        console.log("email send:",info.response);
        
    }catch(error){
        console.error('Error sending email:', error);
        throw new Error ("Email didn't send");
    };
};

export default sendMail;