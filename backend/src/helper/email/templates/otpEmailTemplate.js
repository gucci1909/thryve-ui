export const generateOtpEmailTemplate = (user, otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 120px; height: auto; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
    .otp-box { 
      background: #0029ff;
      color: white;
      padding: 15px;
      border-radius: 5px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer { margin-top: 30px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="[THRYVE_LOGO_URL]" alt="Thryve Logo" class="logo">
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Dear ${user.firstName},</p>
      
      <p>We received a request to reset your password. Please use the following OTP (One-Time Password) to proceed with your password reset:</p>
      
      <div class="otp-box">
        ${otp}
      </div>

      <p><strong>Important Notes:</strong></p>
      <ul>
        <li>This OTP is valid for 10 minutes only</li>
        <li>If you didn't request this password reset, please ignore this email</li>
        <li>For security reasons, please do not share this OTP with anyone</li>
      </ul>

      <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@thryve.ai</p>
    </div>
    
    <div class="footer">
      <p>© 2024 Thryve. All rights reserved.</p>
      <p>This email was sent to ${user.email}</p>
    </div>
  </div>
</body>
</html>
  `;
}; 