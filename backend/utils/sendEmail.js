import nodeMailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async(options)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD
        }
    });
    const mailOptions={
        from:process.env.SMTP_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions);
}

export default sendEmail