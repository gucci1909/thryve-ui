import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const adminDashboardController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('users');
    const companyCollection = db.collection('companies');
    const teamMembersCollection = db.collection('team-members');
    const { companyId } = req.query;

    const companyIdToUse = companyId || req.user?.companyId;

    // Fetch company info for streak calculation
    const companyDetails = await companyCollection.findOne({
      _id: new ObjectId(companyIdToUse),
    });
    const streakDivider = companyDetails?.POINTSSTREAKPERDAY || 20;

    // Aggregation pipeline to find user with highest streak
    const highestStreakPipeline = [
      {
        $match: {
          companyId: companyDetails?.INVITE_CODE || '',
        },
      },
      {
        $addFields: {
          streak: {
            $floor: {
              $divide: [{ $ifNull: ['$totalPoints', 0] }, streakDivider],
            },
          },
        },
      },
      {
        $sort: { streak: -1 },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 1,
          name: '$firstName',
          email: 1,
          totalPoints: 1,
          streak: 1,
        },
      },
    ];

    const [highestStreakUser] = await userCollection.aggregate(highestStreakPipeline).toArray();

    // Compute company-wide NPS
    const companyTeamMembers = await teamMembersCollection
      .aggregate([
        {
          $match: {
            assessment: true,
            companyCode: companyDetails?.INVITE_CODE || '',
          },
        },
        {
          $group: {
            _id: '$userId',
            teamMembers: { $push: '$$ROOT' },
          },
        },
      ])
      .toArray();

    let companyPromoters = 0;
    let companyDetractors = 0;
    let companyValidResponses = 0;

    companyTeamMembers.forEach((managerGroup) => {
      managerGroup.teamMembers.forEach((member) => {
        const score = member?.feedbackData?.npsScore;
        if (typeof score === 'number') {
          companyValidResponses++;
          if (score >= 9) companyPromoters++;
          else if (score <= 6) companyDetractors++;
        }
      });
    });

    const companyAverageNps =
      companyValidResponses > 0
        ? ((companyPromoters - companyDetractors) / companyValidResponses) * 100
        : 0;

    res.json({
      success: true,
      highestStreakUser: highestStreakUser || null,
      scores_from_company_nps: companyAverageNps.toFixed(2),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get admin dashboard data' });
    return;
  }
};
