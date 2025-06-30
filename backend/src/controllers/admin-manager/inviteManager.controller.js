import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db.js';
import { sendEmail } from '../../helper/email/sendEmail.js';

const generateManagerInviteEmailTemplate = (manager, company, inviteCode) => {
  const inviteLink = `${process.env.FRONTEND_URL}/signup?invite-code=${inviteCode}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manager Invitation - Join Thryve</title>
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
        <h2><i class="fas fa-user-tie" style="margin-right: 10px; color: #ffd700;"></i>Manager Invitation</h2>
        
        <p class="greeting">Hi <strong>${manager.name || manager.email}</strong>,</p>
        
        <div class="icon-text">
          <div>
            You've been invited to join <strong>${company.COMPANY_NAME}</strong> as a manager on <strong>Thryve</strong> - the platform that helps managers become better leaders through continuous feedback and development.
          </div>
        </div>

        <div class="highlight-box">
          <div class="icon-text" style="background: transparent !important; padding: 0 !important; margin: 0 !important; border-left: none !important; box-shadow: none !important;">
            <div class="content-box">
              As a manager on Thryve, you'll have access to leadership assessments, personalized learning plans, coaching conversations, and tools to track your team's feedback and your own growth journey.
            </div>
          </div>
        </div>

        <div class="icon-text">
          <div>
            Join your team and start your leadership development journey. Click the button below to set up your account and begin your first leadership assessment.
          </div>
        </div>

        <div class="button-container">
          <a href="${inviteLink}" class="button">
            <i class="fas fa-rocket" style="margin-right: 10px;"></i> Join Thryve as Manager
          </a>
        </div>

        <p class="signature">
          <i class="fas fa-handshake" style="color: #28a745; margin-right: 8px;"></i>
          Welcome to the team! We're excited to support your leadership growth.
        </p>
      </div>
      <div class="footer">
        <p><i class="fas fa-copyright" style="margin-right: 8px; color: #0029ff;"></i> 2025 Thryve. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">
          <i class="fas fa-shield-alt" style="margin-right: 5px;"></i>Your account and data are secure
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export const existingManagerController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('users');
    // const companyCollection = db.collection('companies');
    const inviteSentCollection = db.collection('invite-sent');
    const { companyId } = req.query;

    const { manager_id } = req.body;

    if (!manager_id) {
      return res.status(400).json({
        success: false,
        error: 'Manager ID is required',
      });
    }

    const companyIdToUse = companyId || req.user?.companyId;

    const companyDetails = await companyCollection.findOne({
      _id: new ObjectId(companyIdToUse),
    });

    // Find the existing manager
    const manager = await userCollection.findOne({
      _id: new ObjectId(manager_id),
      companyId: companyDetails.INVITE_CODE || '',
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        error: 'Manager not found',
      });
    }

    // Send invitation email
    const emailTemplate = generateManagerInviteEmailTemplate(
      { name: manager.firstName, email: manager.email },
      companyDetails,
      companyDetails?.INVITE_CODE,
    );

    const emailResult = await sendEmail(
      { name: manager.firstName, email: manager.email },
      "You've Been Invited to Join Thryve as a Manager",
      emailTemplate,
    );

    // Store invitation details in invite-sent collection
    const inviteRecord = {
      managerId: manager._id,
      managerName: manager.firstName,
      managerEmail: manager.email,
      companyCode: companyId || req.user?.companyId,
      companyName: company.COMPANY_NAME,
      invitedBy: req.user.id,
      invitedByEmail: req.user.email,
      inviteType: 'existing_manager',
      emailStatus: emailResult.success ? 'sent' : 'failed',
      inviteCode: company?.INVITE_CODE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await inviteSentCollection.insertOne(inviteRecord);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Invitation email sent successfully',
        manager: {
          id: manager._id,
          name: manager.firstName,
          email: manager.email,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send invitation email',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send invitation to existing manager' });
    return;
  }
};

export const newManagerInviteController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('users');
    const companyCollection = db.collection('companies');
    const inviteSentCollection = db.collection('invite-sent');
    const { companyId } = req.query;

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    const companyIdToUse = companyId || req.user?.companyId;

    // Get company details
    const company = await companyCollection.findOne({
      _id: new ObjectId(companyIdToUse),
    });

    // Check if user already exists
    const existingUser = await userCollection.findOne({
      email: email.toLowerCase(),
      companyId: companyId || req.user?.companyId,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists in the company',
      });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    // Send invitation email
    const emailTemplate = generateManagerInviteEmailTemplate(
      { name, email },
      company,
      company?.INVITE_CODE,
    );
    const emailResult = await sendEmail(
      { name: name, email: email },
      "You've Been Invited to Join Thryve as a Manager",
      emailTemplate,
    );

    // Store invitation details in invite-sent collection
    const inviteRecord = {
      managerName: name,
      managerEmail: email.toLowerCase(),
      companyCode: companyId || req.user?.companyId,
      companyName: company.COMPANY_NAME,
      invitedBy: req.user.id,
      invitedByEmail: req.user.email,
      inviteType: 'new_manager',
      emailStatus: emailResult.success ? 'sent' : 'failed',
      inviteCode: company?.INVITE_CODE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await inviteSentCollection.insertOne(inviteRecord);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Manager invitation email sent successfully',
        manager: {
          name: name,
          email: email,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send invitation email',
        manager: {
          name: name,
          email: email,
        },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create and invite new manager' });
    return;
  }
};
