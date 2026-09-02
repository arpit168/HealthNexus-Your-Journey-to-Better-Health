import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

const SendEmail = async (to, subject, message) => {
  try {
    console.log("started sending email");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    console.log("121212");

    const mailOption = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: message,
    };

    const res = await transporter.sendMail(mailOption);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export default SendEmail;

// SendEmail(
//   "pgupta4222@gmail.com",
//   "testEmail",
//   "<p style='color: red;'>Your Cravings Server is running. please check is everything fine.</p>"
// );
