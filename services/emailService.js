const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER || 'vanshmirani09@gmail.com',
      pass: process.env.NODEMAILER_PASS || ''
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER || 'Electrostock <vanshmirani09@gmail.com>',
    to: email,
    subject: 'Electrostock Password Reset OTP',
    text: `Your OTP is ${otp}. Expires in 10 minutes.`,
    html: `<h2>Password Reset OTP</h2><p><strong style="font-size: 32px; letter-spacing: 5px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 15px 25px; border-radius: 8px; display: inline-block;">${otp}</strong></p>`
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${email}`);
};

module.exports = { generateOTP, sendOTPEmail };

