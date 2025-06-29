import { getDb } from '../../config/db.js';
import z from 'zod';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { sendEmail } from '../../helper/email/sendEmail.js';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

const requestSchema = z.object({
  companyCode: z.string().min(1, 'Company invite code is required'),
  feedbackRequests: z.array(teamMemberSchema),
});

function generateInviteCode(teamMember, userId, company, req) {
  const timestamp = new Date().toISOString();
  const ipAddress = req.ip || req.connection.remoteAddress;

  const uniqueString = `${userId}-${company._id}-${timestamp}-${teamMember.name}-${teamMember.email}-${ipAddress}`;
  const hash = crypto.createHash('sha1').update(uniqueString).digest('hex');

  return hash;
};

const generateEmailTemplate = (teamMember, manager, company) => {
  const assessmentLink = `${process.env.FRONTEND_URL}/feedback-assessment?inviteCode=${teamMember.INVITE_CODE}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leadership Assessment Invitation</title>
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
        <h2><i class="fas fa-star" style="margin-right: 10px; color: #ffd700;"></i>Leadership Assessment Invitation</h2>
        
        <p class="greeting">Hi <strong>${teamMember.name}</strong>,</p>
        
        <div class="icon-text">
          <div>
            We're using <strong>Thryve</strong> to help our managers grow into better leaders — starting with honest input from the people who work with them every day: <strong>You</strong>.
          </div>
        </div>

        <div class="highlight-box">
          <div class="icon-text" style="background: transparent !important; padding: 0 !important; margin: 0 !important; border-left: none !important; box-shadow: none !important;">
            <div class="content-box">
              This is <strong>not a performance review</strong>. It's a developmental tool designed to give managers insights into how their leadership is experienced by their team — what's working well, and where they can improve.
            </div>
          </div>
        </div>

        <div class="icon-text">
          <div>
            Your responses will remain <strong>confidential</strong>. By taking just a few minutes to complete the leadership assessment, you'll be helping your manager build stronger habits, improve team dynamics, and become the leader you deserve.
          </div>
        </div>

        <div class="button-container">
          <a href="${assessmentLink}" class="button">
            <i class="fas fa-play" style="margin-right: 10px;"></i> Start the Leadership Assessment
          </a>
        </div>

        <p class="signature">
          <i class="fas fa-heart" style="color: #ff6b6b; margin-right: 8px;"></i>
          Thank you for contributing to a culture of open, constructive feedback.
        </p>
      </div>
      <div class="footer">
        <p><i class="fas fa-copyright" style="margin-right: 8px; color: #0029ff;"></i> 2025 Thryve. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">
          <i class="fas fa-shield-alt" style="margin-right: 5px;"></i>Your feedback is secure and confidential
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export const addTeamMembers = async (req, res) => {
  try {
    const db = getDb();
    const teamMembersCollection = db.collection('team-members');
    const companiesCollection = db.collection('companies');

    requestSchema.parse(req.body);
    const { companyCode, feedbackRequests } = req.body;

    const company = await companiesCollection.findOne({ INVITE_CODE: companyCode });
    if (!company) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Invalid company invite code',
      });
    }

    const teamMemberDocuments = feedbackRequests.map((member) => ({
      userId: req.user.id,
      userEmail: req.user.email,
      companyName: company.COMPANY_NAME,
      name: member.name,
      email: member.email,
      INVITE_CODE: generateInviteCode(member, req.user.id, company, req),
      companyCode: companyCode,
      status: 'email_pending',
      assessment: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const emailsToInsert = feedbackRequests.map((member) => member.email);

    const existingMembers = await teamMembersCollection
      .find({
        email: { $in: emailsToInsert },
        userId: req.user.id,
      })
      .toArray();

    if (existingMembers.length > 0) {
      const duplicateEmails = existingMembers.map((member) => member.email);
      return res.status(409).json({
        status: 'Not OK',
        error:
          'Duplicate email(s) detected. Please remove the already registered email addresses before submitting.',
        duplicates: duplicateEmails,
      });
    }

    const result = await teamMembersCollection.insertMany(teamMemberDocuments);
    const emailPromises = teamMemberDocuments.map(async (teamMember) => {
      const emailTemplate = generateEmailTemplate(teamMember, req.user, company);
      const emailResult = await sendEmail(
        { name: teamMember.name, email: teamMember.email },
        'Help Your Manager Grow – Share Feedback via Thryve',
        emailTemplate,
      );

      if (emailResult.success) {
        await teamMembersCollection.updateOne(
          { _id: teamMember._id },
          { $set: { status: 'email_sent', updatedAt: new Date() } },
        );
      } else {
        await teamMembersCollection.updateOne(
          { _id: teamMember._id },
          { $set: { status: 'email_failed', updatedAt: new Date() } },
        );
      }

      return emailResult;
    });

    const emailResults = await Promise.all(emailPromises);

    return res.status(200).json({
      status: 'OK',
      data: {
        insertedCount: result.insertedCount,
        teamMembers: teamMemberDocuments,
        emailResults: emailResults.map((result, index) => ({
          email: teamMemberDocuments[index].email,
          success: result.success,
        })),
      },
    });
  } catch (error) {
    console.error('Add Team Members Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to add team members',
    });
  }
};

export const getMemberInfo = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    if (!inviteCode) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Invite code is required',
      });
    }

    const db = getDb();
    const teamMembersCollection = db.collection('team-members');
    const companiesCollection = db.collection('companies');
    const usersCollection = db.collection('users');

    // Find team member by invite code
    const teamMember = await teamMembersCollection.findOne({ INVITE_CODE: inviteCode });

    if (!teamMember) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Invalid invite code',
      });
    }

    // Get company details
    const company = await companiesCollection.findOne({ INVITE_CODE: teamMember.companyCode });

    if (!company) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Company not found',
      });
    }

    // Get manager details
    const manager = await usersCollection.findOne({ _id: new ObjectId(teamMember.userId) });

    if (!manager) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Manager not found',
      });
    }

    // Check if assessment is already completed
    if (teamMember.assessment) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Assessment already completed',
      });
    }

    // Return all required information
    return res.status(200).json({
      status: 'OK',
      data: {
        teamMember: {
          name: teamMember.name,
          email: teamMember.email,
          status: teamMember.status,
          assessment: teamMember.assessment,
        },
        company: {
          name: company.COMPANY_NAME,
          aboutText: company.ABOUT_TEXT,
        },
        manager: {
          name: manager.firstName,
          email: manager.email,
        },
      },
    });
  } catch (error) {
    console.error('Get Member Info Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch member information',
    });
  }
};

export const saveFeedbackData = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const feedbackData = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Invite code is required',
      });
    }

    const db = getDb();
    const teamMembersCollection = db.collection('team-members');

    // Find team member by invite code
    const teamMember = await teamMembersCollection.findOne({ INVITE_CODE: inviteCode });

    if (!teamMember) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Invalid invite code',
      });
    }

    // Check if assessment is already completed
    if (teamMember.assessment) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Assessment already completed',
      });
    }

    const categoryResults = {};

    feedbackData?.ratingQuestions?.forEach((item) => {
      if (!categoryResults[item.category]) {
        categoryResults[item.category] = { sum: 0, count: 0 };
      }
      categoryResults[item.category].sum += item.response;
      categoryResults[item.category].count += 1;
    });

    const finalAverages = {};
    for (const [category, { sum, count }] of Object.entries(categoryResults)) {
      finalAverages[category] = sum / count;
    }

    // Update team member document with feedback data and mark assessment as completed
    const result = await teamMembersCollection.updateOne(
      { INVITE_CODE: inviteCode },
      {
        $set: {
          assessment: true,
          assessmentCompletedAt: new Date(),
          feedbackData: {
            ratingQuestions: feedbackData.ratingQuestions,
            npsScore: feedbackData.npsScore,
            openEndedQuestions: feedbackData.openEndedQuestions,
            overallProgress: feedbackData.overallProgress,
            categoryProgress: feedbackData.categoryProgress,
          },
          scores_of_manager_feedback: finalAverages,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({
        status: 'Not OK',
        error: 'Failed to save feedback data',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Feedback saved successfully',
    });
  } catch (error) {
    console.error('Save Feedback Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to save feedback data',
    });
  }
};

export const getExistingTeamMembers = async (req, res) => {
  try {
    const db = getDb();
    const teamMembersCollection = db.collection('team-members');

    // Get all team members for the current user
    const teamMembers = await teamMembersCollection
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      status: 'OK',
      data: {
        teamMembers: teamMembers.map((member) => ({
          _id: member._id,
          name: member.name,
          email: member.email,
          status: member.status,
          assessment: member.assessment,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get Existing Team Members Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch team members',
    });
  }
};

export const resendEmailsToTeamMembers = async (req, res) => {
  try {
    const { teamMemberIds } = req.body;

    if (!teamMemberIds || !Array.isArray(teamMemberIds) || teamMemberIds.length === 0) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Team member IDs are required',
      });
    }

    const db = getDb();
    const teamMembersCollection = db.collection('team-members');
    const companiesCollection = db.collection('companies');

    // Get team members by IDs
    const teamMembers = await teamMembersCollection
      .find({
        _id: { $in: teamMemberIds.map((id) => new ObjectId(id)) },
        userId: req.user.id,
      })
      .toArray();

    if (teamMembers.length === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'No team members found',
      });
    }

    // Get company details (assuming all team members belong to the same company)
    const company = await companiesCollection.findOne({ INVITE_CODE: teamMembers[0].companyCode });

    if (!company) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Company not found',
      });
    }

    // Resend emails to selected team members
    const emailPromises = teamMembers.map(async (teamMember) => {
      const emailTemplate = generateEmailTemplate(teamMember, req.user, company);
      const emailResult = await sendEmail(
        { name: teamMember.name, email: teamMember.email },
        'Help Your Manager Grow – Share Feedback via Thryve',
        emailTemplate,
      );

      // Update team member status based on email sending result
      if (emailResult.success) {
        await teamMembersCollection.updateOne(
          { _id: teamMember._id },
          { $set: { status: 'email_sent', updatedAt: new Date() } },
        );
      } else {
        await teamMembersCollection.updateOne(
          { _id: teamMember._id },
          { $set: { status: 'email_failed', updatedAt: new Date() } },
        );
      }

      return {
        teamMemberId: teamMember._id,
        email: teamMember.email,
        success: emailResult.success,
      };
    });

    // Wait for all emails to be sent
    const emailResults = await Promise.all(emailPromises);

    const successfulEmails = emailResults.filter((result) => result.success);
    const failedEmails = emailResults.filter((result) => !result.success);

    return res.status(200).json({
      status: 'OK',
      data: {
        totalSent: emailResults.length,
        successful: successfulEmails.length,
        failed: failedEmails.length,
        emailResults,
      },
      message: `Successfully sent ${successfulEmails.length} out of ${emailResults.length} emails`,
    });
  } catch (error) {
    console.error('Resend Emails Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to resend emails',
    });
  }
};
