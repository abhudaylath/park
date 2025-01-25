import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS
    }
});

async function sendEmail(email:string,emailHtml:string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your booking has been confirmed',
        html:emailHtml
    };
    console.log(mailOptions);
    
    await transporter.sendMail(mailOptions);
}

export default sendEmail