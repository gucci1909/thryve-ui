import { getDb } from '../../config/db.js';
import z from 'zod';

// Validation schema for team member
const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format")
});

// Validation schema for request body
const requestSchema = z.object({
  feedbackRequests: z.array(teamMemberSchema)
});

export const addTeamMembers = async (req, res) => {
  try {
    const db = getDb();
    const teamMembersCollection = db.collection('team_members');

    // Validate request body
    requestSchema.parse(req.body);
    const { feedbackRequests } = req.body;

    // Generate random invite codes and create documents for each team member
    const teamMemberDocuments = feedbackRequests.map(member => ({
      userId: req.user.id,
      userEmail: req.user.email,
      name: member.name,
      email: member.email,
      inviteCode: Math.random().toString(36).substring(2, 15),
      status: 'email_pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert all team members
    const result = await teamMembersCollection.insertMany(teamMemberDocuments);

    return res.status(200).json({
      status: 'OK',
      data: {
        insertedCount: result.insertedCount,
        teamMembers: teamMemberDocuments
      }
    });

  } catch (error) {
    console.error('Add Team Members Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to add team members'
    });
  }
}; 