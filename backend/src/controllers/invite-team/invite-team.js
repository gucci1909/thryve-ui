import { getDb } from '../../config/db.js';
import z from 'zod';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { sendEmail } from '../../helper/email/sendEmail.js';

// Validation schema for team member
const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

// Validation schema for request body
const requestSchema = z.object({
  companyCode: z.string().min(1, 'Company invite code is required'),
  feedbackRequests: z.array(teamMemberSchema),
});

function generateInviteCode(teamMember, userId, company, req) {
  // Combine multiple unique identifiers
  const timestamp = new Date().toISOString();
  const ipAddress = req.ip || req.connection.remoteAddress;

  // Create a unique string combining all parameters
  const uniqueString = `${userId}-${company._id}-${timestamp}-${teamMember.name}-${teamMember.email}-${ipAddress}`;

  // Generate SHA1 hash
  const hash = crypto.createHash('sha1').update(uniqueString).digest('hex');

  // Format the code to be more readable: THR-XXXXX-XXXXX-XXXXX
  // return `THR-${hash.slice(0, 5)}-${hash.slice(5, 10)}-${hash.slice(10, 15)}`;
  return hash;
}

const generateEmailTemplate = (teamMember, manager, company) => {
  const assessmentLink = `${process.env.FRONTEND_URL}/feedback-assessment?inviteCode=${teamMember.INVITE_CODE}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Leadership Assessment Invitation</title>
  <style>
    body { 
      font-family: Arial, sans-serif !important; 
      line-height: 1.6 !important; 
      color: #333 !important; 
      margin: 0 !important; 
      padding: 0 !important; 
      background-color: #f4f4f4 !important;
    }
    .container { 
      max-width: 600px !important; 
      margin: 30px auto !important; 
      padding: 20px !important; 
      background-color: #ffffff !important; 
      border-radius: 10px !important; 
      box-shadow: 0 0 10px rgba(0,0,0,0.1) !important; 
    }
    .header { 
      text-align: center !important; 
      margin-bottom: 30px !important; 
    }
    .logo-container { 
      background-color: #0029ff !important; 
      padding: 20px !important; 
      display: flex !important;
      flex-direction: row !important;
      border-top-left-radius: 10px !important; 
      border-top-right-radius: 10px !important;
      justify-content: center !important;
    }
    .logo { 
      width: 45px !important; 
      height: 45px !important; 
      margin-right: 5px !important;
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
    h1 { 
      color: white !important; 
      margin: 10px 0 0 0 !important; 
      font-size: 28px !important; 
    }
    .content { 
      padding: 30px 20px !important; 
    }
    h2 { 
      color: #0029ff !important; 
      font-size: 24px !important; 
      margin-bottom: 20px !important; 
    }
    .button { 
      display: inline-block !important;
      padding: 14px 28px !important;
      background-color: #0029ff !important;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 5px !important;
      font-weight: bold !important;
      margin: 30px auto !important;
    }
    .footer { 
      margin-top: 40px !important; 
      text-align: center !important; 
      color: #777 !important; 
      font-size: 12px !important; 
    }
    .header-1 {
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
    ul { 
      padding-left: 20px !important; 
      margin-top: 10px !important; 
    }
    p { 
      margin: 15px 0 !important; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-container" style="justify-content: center; gap: 5px;">
      <img src="https://i.ibb.co/r9hJXZ3/logo-thryve.png" alt="Thryve Logo" class="logo">
      <h1 class="header-1">thryve</h1>
    </div>
    <div class="content">
      <h2>You're Invited to a Leadership Assessment</h2>
      <p>Dear ${teamMember.name},</p>

      <p><strong>${manager.firstName}</strong> from <strong>${company.COMPANY_NAME}</strong> has nominated you to participate in Thryve's leadership assessment program.</p>

      <p>This carefully designed assessment will help you:</p>
      <ul>
        <li>Evaluate your leadership competencies</li>
        <li>Gain deeper insights into your leadership style</li>
        <li>Identify growth areas for professional development</li>
        <li>Receive personalized feedback to support your career</li>
      </ul>

      <p>The assessment will take approximately <strong>15-20 minutes</strong>. Your responses are confidential and will be analyzed to provide valuable recommendations tailored specifically for you.</p>

      <div style="text-align: center !important;">
        <a href="${assessmentLink}" class="button">Start My Assessment</a>
      </div>

      <p><strong>Please keep in mind:</strong></p>
      <ul>
        <li>Complete the assessment within <strong>7 days</strong></li>
        <li>Choose a quiet environment for best focus</li>
        <li>Answer honestly — there are no right or wrong answers</li>
      </ul>

      <p>If you have any questions or face any issues, feel free to contact us at <a href="mailto:support@thryve.ai">support@thryve.ai</a>.</p>
    </div>

    <div class="footer">
      <p>© 2025 Thryve. All rights reserved.</p>
      <p>This email was sent to ${teamMember.email}</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const addTeamMembers = async (req, res) => {
  try {
    const db = getDb();
    const teamMembersCollection = db.collection('team_members');
    const companiesCollection = db.collection('companies');

    // Validate request body
    requestSchema.parse(req.body);
    const { companyCode, feedbackRequests } = req.body;

    // Verify company invite code
    const company = await companiesCollection.findOne({ INVITE_CODE: companyCode });
    if (!company) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Invalid company invite code',
      });
    }

    // Generate random invite codes and create documents for each team member
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

    // Insert all team members
    const result = await teamMembersCollection.insertMany(teamMemberDocuments);

    // Send emails to each team member
    const emailPromises = teamMemberDocuments.map(async (teamMember) => {
      const emailTemplate = generateEmailTemplate(teamMember, req.user, company);
      const emailResult = await sendEmail(
        { name: teamMember.name, email: teamMember.email },
        'Leadership Assessment Invitation',
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

      return emailResult;
    });

    // Wait for all emails to be sent
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
    const teamMembersCollection = db.collection('team_members');
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
    const teamMembersCollection = db.collection('team_members');

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
