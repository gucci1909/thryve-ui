import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db.js';

export const allManagerController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('users');
    const companyCollection = db.collection('companies');

    const { search = '', page = 1, limit = 6, sort = 'new' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const { companyId } = req.query;

    const companyIdToUse = companyId || req.user?.companyId;
    const companyDetails = await companyCollection.findOne({
      _id: new ObjectId(companyIdToUse),
    });

    const streakDivider = companyDetails?.POINTSSTREAKPERDAY || 20;

    const sortOption = sort === 'old' ? { createdAt: 1 } : { createdAt: -1 };

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          companyId: companyDetails.INVITE_CODE || '',
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sortOption,
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: 'chats',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$user_id', '$$userIdStr'],
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'chatsCount',
        },
      },
      {
        $lookup: {
          from: 'role-play-chats',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$user_id', '$$userIdStr'],
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'rolePlayCount',
        },
      },
      {
        $lookup: {
          from: 'goals',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$userId', '$$userIdStr'],
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'goalCount',
        },
      },
      {
        $lookup: {
          from: 'reflections',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$userId', '$$userIdStr'],
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          as: 'reflectionCount',
        },
      },
      {
        $lookup: {
          from: 'interactions',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user_id', '$$userIdStr'] },
                    { $eq: ['$interaction_type', 'LEARNING'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'learningInteractionsCount',
        },
      },
      {
        $lookup: {
          from: 'team-members',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$userIdStr'] }, { $eq: ['$assessment', true] }],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'teamMembersCount',
        },
      },
      {
        $addFields: {
          chats: { $ifNull: [{ $arrayElemAt: ['$chatsCount.count', 0] }, 0] },
          rolePlays: { $ifNull: [{ $arrayElemAt: ['$rolePlayCount.count', 0] }, 0] },
          goals: { $ifNull: [{ $arrayElemAt: ['$goalCount.count', 0] }, 0] },
          reflections: { $ifNull: [{ $arrayElemAt: ['$reflectionCount.count', 0] }, 0] },
          learningInteractions: {
            $ifNull: [{ $arrayElemAt: ['$learningInteractionsCount.count', 0] }, 0],
          },
          teamMembers: { $ifNull: [{ $arrayElemAt: ['$teamMembersCount.count', 0] }, 0] },
          streak: {
            $floor: {
              $divide: [{ $ifNull: ['$totalPoints', 0] }, streakDivider],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: '$firstName',
          points: '$totalPoints',
          email: 1,
          status: 1,
          createdAt: 1,
          streak: 1,
          chats: 1,
          rolePlays: 1,
          goals: 1,
          reflections: 1,
          learningInteractions: 1,
          teamMembers: 1,
        },
      },
    ];

    const usersWithCounts = await userCollection.aggregate(pipeline).toArray();
    const total = await userCollection.countDocuments({
      companyId: companyCollection.INVITE_CODE || '',
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });

    res.json({
      success: true,
      users: usersWithCounts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get data for the users' });
    return;
  }
};

export const singleManagerController = async (req, res) => {
  try {
    const db = getDb();
    const userCollection = db.collection('users');
    const companyCollection = db.collection('companies');
    const teamMembersCollection = db.collection('team-members');

    const { manager_id = '' } = req.query;
    const { companyId } = req.query;
    if (!manager_id) return res.status(400).json({ error: 'Manager ID is required' });

    const companyIdToUse = companyId || req.user?.companyId;

    const companyDetails = await companyCollection.findOne({
      _id: new ObjectId(companyIdToUse),
    });

    const streakDivider = companyDetails?.POINTSSTREAKPERDAY || 20;

    const pipeline = [
      {
        $match: {
          _id: new ObjectId(manager_id),
          companyId: companyDetails?.INVITE_CODE || '',
        },
      },
      {
        $lookup: {
          from: 'chats',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user_id', '$$userIdStr'] },
              },
            },
            { $count: 'count' },
          ],
          as: 'chatsCount',
        },
      },
      {
        $lookup: {
          from: 'role-play-chats',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user_id', '$$userIdStr'] },
              },
            },
            { $count: 'count' },
          ],
          as: 'rolePlayCount',
        },
      },
      {
        $lookup: {
          from: 'goals',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userIdStr'] },
              },
            },
          ],
          as: 'goals',
        },
      },
      {
        $lookup: {
          from: 'reflections',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userIdStr'] },
              },
            },
          ],
          as: 'reflections',
        },
      },
      {
        $lookup: {
          from: 'interactions',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user_id', '$$userIdStr'] },
                    { $eq: ['$interaction_type', 'LEARNING'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'learningInteractionsCount',
        },
      },
      {
        $lookup: {
          from: 'chat-feedback',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userIdStr'] },
                    { $eq: ['$decision', 'YES_READY'] },
                    { $eq: ['$chatType', 'coaching'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'chatFeedbackCoachingCount',
        },
      },
      {
        $lookup: {
          from: 'chat-feedback',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userIdStr'] },
                    { $eq: ['$decision', 'YES_READY'] },
                    { $eq: ['$chatType', 'roleplay'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'chatFeedbackRolePlayCount',
        },
      },
      {
        $lookup: {
          from: 'team-members',
          let: { userIdStr: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$userIdStr'] }, { $eq: ['$assessment', true] }],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'teamMembersCount',
        },
      },
      {
        $addFields: {
          chats: { $ifNull: [{ $arrayElemAt: ['$chatsCount.count', 0] }, 0] },
          rolePlays: { $ifNull: [{ $arrayElemAt: ['$rolePlayCount.count', 0] }, 0] },
          chatFeedbackCoaching: {
            $ifNull: [{ $arrayElemAt: ['$chatFeedbackCoachingCount.count', 0] }, 0],
          },
          chatFeedbackRolePlay: {
            $ifNull: [{ $arrayElemAt: ['$chatFeedbackRolePlayCount.count', 0] }, 0],
          },
          learningInteractions: {
            $ifNull: [{ $arrayElemAt: ['$learningInteractionsCount.count', 0] }, 0],
          },
          teamMembers: { $ifNull: [{ $arrayElemAt: ['$teamMembersCount.count', 0] }, 0] },
          streak: {
            $floor: {
              $divide: [{ $ifNull: ['$totalPoints', 0] }, streakDivider],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: '$firstName',
          points: '$totalPoints',
          email: 1,
          status: 1,
          createdAt: 1,
          streak: 1,
          chats: 1,
          rolePlays: 1,
          learningInteractions: 1,
          teamMembers: 1,
          goals: 1,
          reflections: 1,
          chatFeedbackCoaching: 1,
          chatFeedbackRolePlay: 1,
        },
      },
    ];

    const [userWithCounts] = await userCollection.aggregate(pipeline).toArray();

    if (!userWithCounts) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const managerTeamMembers = await teamMembersCollection
      .find({ userId: manager_id, assessment: true })
      .toArray();

    let averageManagerNpsScore = 0;

    if (managerTeamMembers.length === 0) {
      res.json({
        success: true,
        manager: userWithCounts,
        scores_from_team_nps: 0,
      });
      return;
    }

    // Compute manager's NPS
    let promoters = 0;
    let detractors = 0;
    let validResponses = 0;

    managerTeamMembers?.forEach((member) => {
      const score = member?.feedbackData?.npsScore;
      if (typeof score === 'number') {
        validResponses++;
        if (score >= 9) promoters++;
        else if (score <= 6) detractors++;
      }
    });

    averageManagerNpsScore =
      validResponses > 0 ? ((promoters - detractors) / validResponses) * 100 : 0;

    res.json({
      success: true,
      manager: userWithCounts,
      scores_from_team_nps: averageManagerNpsScore.toFixed(2),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get data for a single user' });
  }
};

export const singleManagerLearningPlanController = async (req, res) => {
  try {
    const db = getDb();
    const learningPlansCollection = db.collection('learning-plans');

    const { manager_id = '' } = req.query;
    if (!manager_id) return res.status(400).json({ error: 'Manager ID is required' });

    const existingLearningPlans = await learningPlansCollection
      .find({ userId: manager_id })
      .sort({ updated_at: -1 })
      .toArray();

    const mergedLearningPlan = existingLearningPlans?.reduce((acc, existingLearningPlan) => {
      return acc.concat(existingLearningPlan?.learning_plan);
    }, []);

    const filteredLearningPlans = mergedLearningPlan?.filter(
      (plan) => Array.isArray(plan?.notes) && plan?.notes?.length > 0,
    );

    res.json({
      success: true,
      learningPlans: filteredLearningPlans,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get data for a single user' });
  }
};
