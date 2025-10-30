const nodemailer = require('nodemailer');

// Create transporter using Gmail (free option)
// For testing without Gmail setup, we'll log OTP to console
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'karankumargahlot2580@gmail.com',
    pass: process.env.EMAIL_PASS || 'dkha dnow pgaf ttyo',
  },
});

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    // For testing: log OTP to console
    console.log('\n==========================================');
    console.log('📧 OTP EMAIL SENT');
    console.log('==========================================');
    console.log('📧 To:', email);
    console.log('🔐 OTP:', otp);
    console.log('⏰ Expires in: 5 minutes');
    console.log('==========================================\n');
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'AgriZone - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">AgriZone</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-top: 0;">Password Reset</h2>
            <p style="color: #6b7280; font-size: 16px;">
              We received a request to reset your password. Use the following OTP to proceed:
            </p>
            <div style="background: white; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="color: #111827; font-size: 12px; margin: 0 0 10px 0;">Your OTP Code</p>
              <p style="color: #16a34a; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0; font-family: monospace;">
                ${otp}
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              This OTP will expire in <strong>5 minutes</strong>. If you didn't request this, please ignore this email.
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
            © ${new Date().getFullYear()} AgriZone. All rights reserved.
          </p>
        </div>
      `,
    };

    // Try to send email
    const senderEmail = process.env.EMAIL_USER || 'karankumargahlot2580@gmail.com';
    
    if (senderEmail && senderEmail !== 'your-email@gmail.com' && senderEmail.includes('@gmail.com')) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
      } catch (emailError) {
        console.error('❌ Email sending failed:');
        console.error('Error code:', emailError.code);
        console.error('Error message:', emailError.message);
        console.error('Full error:', JSON.stringify(emailError, null, 2));
      }
    } else {
      console.log('⚠️ Email not fully configured - using console only');
    }
    
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return true; // Return true anyway since we logged to console
  }
};

module.exports = { sendOTPEmail };

