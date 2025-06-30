import { getDb } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../../helper/email/sendEmail.js';

function generateInviteCode(companyName) {
  const hash = crypto.createHash('md5').update(companyName).digest('hex').toUpperCase();
  return `MD5-${hash.slice(0, 3)}-${hash.slice(-3)}`;
}

const generateEmailTemplate = (hrDetails, companyDetails, loginCredentials) => {
  const joiningLink = `http://localhost:5173/`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HR Onboarding Invitation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important; 
      line-height: 1.6 !important; 
      color: #333 !important; 
      margin: 0 !important; 
      padding: 0 !important; 
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
      min-height: 100vh !important;
    }
    
    .email-wrapper {
      padding: 20px !important;
      min-height: 100vh !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .container { 
      max-width: 650px !important; 
      width: 100% !important;
      margin: 0 auto !important; 
      background-color: #ffffff !important; 
      border-radius: 20px !important; 
      box-shadow: 0 20px 60px rgba(0, 41, 255, 0.15) !important; 
      overflow: hidden !important;
      position: relative !important;
    }
    
    .container::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 4px !important;
      background: linear-gradient(90deg, #0029ff 0%, #1a4bff 50%, #4d79ff 100%) !important;
    }
    
    .logo-container { 
      background: linear-gradient(135deg, #0029ff 0%, #1a4bff 50%, #4d79ff 100%) !important; 
      padding: 20px; 
      display: flex !important;
      flex-direction: row !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 20px !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    .logo-container::before {
      content: '' !important;
      position: absolute !important;
      top: -50% !important;
      right: -50% !important;
      width: 200% !important;
      height: 200% !important;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%) !important;
      animation: float 6s ease-in-out infinite !important;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    .logo { 
      width: 50px !important; 
      height: 50px !important; 
      margin-top: auto !important;
      margin-bottom: auto !important;
      margin-right: 5px !important;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)) !important;
      position: relative !important;
      z-index: 2 !important;
    }
    
    h1 { 
      color: white !important; 
      margin: 0 !important; 
      font-size: 36px !important; 
      font-weight: 800 !important;
      letter-spacing: 1px !important;
      text-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
      position: relative !important;
      z-index: 2 !important;
    }
    
    .content { 
      padding: 30px; 
      background-color: #ffffff !important;
      position: relative !important;
    }
    
    .content::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 80px !important;
      height: 4px !important;
      background: linear-gradient(90deg, #0029ff 0%, #1a4bff 100%) !important;
      border-radius: 2px !important;
    }
    
    h2 { 
      color: #0029ff !important; 
      font-size: 28px !important; 
      font-weight: 700 !important;
      position: relative !important;
      padding-bottom: 5px !important;
      text-align: center !important;
    }
    
    h2:after {
      content: "" !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 80px !important;
      height: 4px !important;
      background: linear-gradient(90deg, #0029ff 0%, rgba(0,41,255,0.3) 100%) !important;
      border-radius: 4px !important;
    }
    
    .greeting {
      text-align: center !important;
      font-size: 18px !important;
      font-weight: 500 !important;
      color: #555 !important;
    }
    
    .button-container {
      text-align: center !important;
      margin: 40px 0 !important;
      padding: 12px !important;
      background: linear-gradient(135deg, rgba(0, 41, 255, 0.05) 0%, rgba(26, 75, 255, 0.05) 100%) !important;
      border-radius: 16px !important;
      border: 2px solid rgba(0, 41, 255, 0.1) !important;
    }
    
    .button { 
      display: inline-block !important;
      padding: 18px 40px !important;
      background: linear-gradient(135deg, #0029ff 0%, #1a4bff 100%) !important;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      box-shadow: 0 8px 25px rgba(0, 41, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      border: none !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    .button::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: -100% !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
      transition: left 0.5s !important;
    }
    
    .button:hover::before {
      left: 100% !important;
    }
    
    .button:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 12px 35px rgba(0, 41, 255, 0.4) !important;
    }
    
    .footer { 
      margin-top: 50px !important; 
      text-align: center !important; 
      color: #777 !important; 
      font-size: 14px !important; 
      padding: 30px 40px !important;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
      border-top: 1px solid #e9ecef !important;
      position: relative !important;
    }
    
    .footer::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 60px !important;
      height: 3px !important;
      background: linear-gradient(90deg, #0029ff 0%, #1a4bff 100%) !important;
      border-radius: 2px !important;
    }
    
    p { 
      margin: 15px !important; 
      font-size: 16px !important;
      line-height: 1.8 !important;
      color: #444 !important;
    }
    
    .icon-text {
      display: flex !important;
      align-items: flex-start !important;
      margin-bottom: 25px !important;
      padding: 20px !important;
      background: rgba(255, 255, 255, 0.8) !important;
      border-radius: 12px !important;
      border-left: 4px solid #0029ff !important;
      box-shadow: 0 4px 15px rgba(0, 41, 255, 0.08) !important;
      transition: transform 0.3s ease !important;
    }
    
    .icon-text:hover {
      transform: translateX(5px) !important;
    }
    
    .icon {
      color: #0029ff !important;
      margin-right: 15px !important;
      font-size: 20px !important;
      margin-top: 2px !important;
      flex-shrink: 0 !important;
      width: 24px !important;
      text-align: center !important;
      background: rgba(0, 41, 255, 0.1) !important;
      padding: 8px !important;
      border-radius: 8px !important;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #f5f7ff 0%, #e8f0ff 100%) !important;
      border: 2px solid rgba(0, 41, 255, 0.15) !important;
      border-radius: 16px !important;
      margin: 30px 0 !important;
      padding: 25px !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    .highlight-box::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 4px !important;
      background: linear-gradient(90deg, #0029ff 0%, #1a4bff 100%) !important;
    }
    
    .credentials-box {
      background: #f8f9fa !important;
      border-radius: 12px !important;
      padding: 20px !important;
      margin: 25px 0 !important;
      border-left: 4px solid #0029ff !important;
    }
    
    .credential-item {
      display: flex !important;
      margin-bottom: 10px !important;
      align-items: center !important;
    }
    
    .credential-label {
      font-weight: 600 !important;
      color: #0029ff !important;
      min-width: 120px !important;
      display: inline-block !important;
    }
    
    .signature {
      margin-top: 40px !important;
      font-style: italic !important;
      color: #666 !important;
      text-align: center !important;
      padding: 20px !important;
      background: rgba(0, 41, 255, 0.03) !important;
      border-radius: 12px !important;
      border: 1px solid rgba(0, 41, 255, 0.1) !important;
    }
    
    .divider {
      height: 1px !important;
      background: linear-gradient(90deg, transparent, #0029ff, transparent) !important;
      margin: 30px 0 !important;
      opacity: 0.3 !important;
    }
    
    @media (max-width: 600px) {
      .email-wrapper {
        padding: 10px !important;
      }
      
      .container {
        border-radius: 16px !important;
      }
      
      .logo-container {
        padding: 30px 20px !important;
        gap: 15px !important;
      }
      
      .logo {
        width: 50px !important;
        height: 50px !important;
      }
      
      h1 {
        font-size: 28px !important;
      }
      
      .content {
        padding: 30px 20px !important;
      }
      
      h2 {
        font-size: 24px !important;
      }
      
      .content-box {
        color: #454545 !important;
      }
      .icon-text {
        padding: 15px !important;
        margin-bottom: 20px !important;
      }
      
      .button {
        padding: 16px 30px !important;
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="logo-container">
        <img src="https://i.ibb.co/r9hJXZ3/logo-thryve.png" alt="Thryve Logo" class="logo">
        <h1>thryve</h1>
      </div>
      <div class="content">
        <h2><i class="fas fa-user-tie" style="margin-right: 10px;"></i>HR Onboarding Invitation</h2>
        
        <p class="greeting">Dear <strong>${hrDetails.name}</strong>,</p>
        
        <div class="icon-text">
          <i class="fas fa-building icon"></i>
          <div>
            <strong>${companyDetails.name}</strong> has invited you to join our HR portal as an administrator. 
            You'll be responsible for onboarding managers and overseeing our leadership development program.
            ${companyDetails.about ? `<p style="margin-top: 10px; margin-bottom: 0;">${companyDetails.about}</p>` : ''}
          </div>
        </div>

        <div class="highlight-box">
          <h3 style="color: #0029ff; margin-bottom: 20px; text-align: center;">
            <i class="fas fa-user-shield" style="margin-right: 10px;"></i>Your Administrator Access
          </h3>
         <div class="credentials-box">
  <h3 style="color: #0029ff; margin-top: 0; margin-bottom: 15px; display: flex; align-items: center;">
    <i class="fas fa-key" style="margin-right: 10px;"></i> Login Credentials
  </h3>
  
  <div class="credential-item">
    <span class="credential-label">
      <i class="fas fa-link" style="margin-right: 8px;"></i> Dashboard URL:
    </span>
    <a href="${joiningLink}" style="color: #0029ff; text-decoration: none; font-weight: 500;">${joiningLink}</a>
  </div>
  
  <div class="credential-item" style="margin-top: 12px;">
    <span class="credential-label">
      <i class="fas fa-envelope" style="margin-right: 8px;"></i> Email:
    </span>
    <strong style="color: #0029ff;">${loginCredentials.email}</strong>
  </div>
  
  <div class="credential-item" style="margin-top: 12px;">
    <span class="credential-label">
      <i class="fas fa-lock" style="margin-right: 8px;"></i> Password:
    </span>
    <strong style="color: #0029ff;">${loginCredentials.password}</strong>
  </div>
  
  <div style="margin-top: 20px; padding: 12px; background: rgba(0, 41, 255, 0.05); border-radius: 8px; border-left: 3px solid #0029ff;">
    <i class="fas fa-exclamation-circle" style="color: #ff9800; margin-right: 8px;"></i>
    <span style="font-size: 14px; color: #555;">
      For security reasons, please change your password after first login
    </span>
  </div>
</div>
        </div>

        <div class="icon-text">
          <i class="fas fa-user-plus icon"></i>
          <div>
            <strong style="display: block; margin-bottom: 8px;">Your Manager Invite Code: ${companyDetails.inviteCode}</strong>
            Use this unique code when onboarding managers to our platform. You can:
            <ul style="margin-top: 10px; padding-left: 20px;">
              <li>Distribute this code to managers for self-registration</li>
              <li>Use it when manually adding managers through your dashboard</li>
              <li>Track all manager onboarding through your admin portal</li>
            </ul>
          </div>
        </div>

        <div class="button-container">
          <a href="${joiningLink}" class="button">
            <i class="fas fa-tachometer-alt" style="margin-right: 10px;"></i> Go to HR Dashboard
          </a>
        </div>

        <div class="divider"></div>

        <div class="icon-text">
          <i class="fas fa-info-circle icon"></i>
          <div>
            <h3 style="color: #0029ff; margin-top: 0;">Getting Started Guide</h3>
            <ol style="padding-left: 20px;">
              <li>Log in using the credentials above</li>
              <li>Set up your profile and security settings</li>
              <li>Review the manager onboarding tutorial</li>
              <li>Begin adding managers using your invite code</li>
              <li>Monitor progress through your dashboard</li>
            </ol>
          </div>
        </div>

        <p class="signature">
          <i class="fas fa-headset" style="color: #0029ff; margin-right: 8px;"></i>
          For any assistance, contact our support team at 
          <a href="mailto:support@thryve.com" style="color: #0029ff; text-decoration: none;">support@thryve.com</a>
        </p>
      </div>
      <div class="footer">
        <p><i class="fas fa-copyright" style="margin-right: 8px; color: #0029ff;"></i> 2025 Thryve. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">
          <i class="fas fa-lock" style="margin-right: 5px;"></i>Secure HR Portal | 
          <i class="fas fa-shield-alt" style="margin-left: 10px; margin-right: 5px;"></i>GDPR Compliant
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export const adminHRInviteController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('admin-users');
    const companyCollection = db.collection('companies');

    const { companyName, aboutText, hrEmail, hrPassword, hrName } = req.body;

    if (!companyName || !aboutText || !hrEmail || !hrPassword || !hrName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate invite code
    const inviteCode = generateInviteCode(companyName);

    // Insert company
    const newCompany = {
      COMPANY_NAME: companyName,
      INVITE_CODE: inviteCode,
      ABOUT_TEXT: aboutText,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const companyResult = await companyCollection.insertOne(newCompany);

    // Hash password
    const hashedPassword = await bcrypt.hash(hrPassword, 10);

    // Insert HR user
    const hrUser = {
      firstName: hrName,
      email: hrEmail,
      role: 'company-admin',
      password: hashedPassword,
      companyId: companyResult.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userCollection.insertOne(hrUser);

    // Prepare and send welcome email
    const emailTemplate = generateEmailTemplate(
      { name: hrName },
      {
        name: companyName,
        about: aboutText,
        inviteCode,
      },
      {
        email: hrEmail,
        password: hrPassword,
      },
    );

    await sendEmail(
      { name: hrName, email: hrEmail },
      'Welcome to Thryve – Your HR Access Details',
      emailTemplate,
    );

    res.status(201).json({ message: 'Company and HR created successfully', inviteCode });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create company and HR user' });
  }
};
