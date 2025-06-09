import { getDb } from '../../config/db.js';
import z from 'zod';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

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
  const hash = crypto.createHash('sha1')
    .update(uniqueString)
    .digest('hex');
  
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
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 120px; height: auto; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
    .button { 
      display: inline-block;
      padding: 12px 24px;
      background-color: #0029ff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
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
      <h2>Leadership Assessment Invitation</h2>
      <p>Dear ${teamMember.name},</p>
      
      <p>I hope this email finds you well. You have been invited by <strong>${manager.firstName}</strong> from <strong>${company.COMPANY_NAME}</strong> to participate in a comprehensive leadership assessment through Thryve.</p>
      
      <p>This assessment is designed to:</p>
      <ul>
        <li>Evaluate key leadership competencies</li>
        <li>Provide valuable insights into your leadership style</li>
        <li>Help identify areas for growth and development</li>
        <li>Contribute to your professional development journey</li>
      </ul>

      <p>The assessment should take approximately 15-20 minutes to complete. Your responses will be kept confidential and will be used to generate personalized insights and recommendations.</p>

      <div style="text-align: center;">
        <a href="${assessmentLink}" class="button">Start Assessment</a>
      </div>

      <p><strong>Important Notes:</strong></p>
      <ul>
        <li>Please complete the assessment within 7 days</li>
        <li>Choose a quiet time and place to ensure best results</li>
        <li>Answer questions honestly - there are no right or wrong answers</li>
      </ul>

      <p>If you have any questions or technical issues, please don't hesitate to reach out to our support team at support@thryve.ai</p>
    </div>
    
    <div class="footer">
      <p>© 2024 Thryve. All rights reserved.</p>
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

    // Generate and log email templates for each team member
    teamMemberDocuments.forEach((teamMember) => {
      const emailTemplate = generateEmailTemplate(teamMember, req.user, company);
      console.log('\n=== Email Template for', teamMember.email, '===\n');
      console.log(emailTemplate);
      console.log('\n=== End Email Template ===\n');
    });

    return res.status(200).json({
      status: 'OK',
      data: {
        insertedCount: result.insertedCount,
        teamMembers: teamMemberDocuments,
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
            openEndedQuestions: feedbackData.openEndedQuestions,
            overallProgress: feedbackData.overallProgress,
            categoryProgress: feedbackData.categoryProgress,
          },
          updatedAt: new Date(),
        },
      }
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
