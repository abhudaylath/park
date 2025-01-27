import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS
    }
});

async function sendEmail(email:string|undefined,emailHtml:string,subject:string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html:emailHtml
    };
    
    await transporter.sendMail(mailOptions);
}

export default sendEmail