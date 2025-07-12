import bcrypt from 'bcryptjs';
import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const allCompaniesIDsController = async (req, res) => {
  try {
    const db = getDb();
    const companies = await db
      .collection('companies')
      .find({}, { projection: { COMPANY_NAME: 1, INVITE_CODE: 1, _id: 1 } })
      .toArray();
    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json({
      message: 'Companies retrieved successfully.',
      companies: companies.map((company) => ({
        name: company.COMPANY_NAME,
        invite_code: company.INVITE_CODE,
        _id: company._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).json({ message: 'Internal server error while retrieving companies.' });
  }
};

export const allCompaniesDetailsController = async (req, res) => {
  try {
    const db = getDb();

    const { search = '', sortBy = 'COMPANY_NAME', sortOrder = 'asc' } = req.query;

    const query = {};

    // If search string provided, filter by company name (case-insensitive)
    if (search) {
      query.COMPANY_NAME = { $regex: search, $options: 'i' };
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const companies = await db
      .collection('companies')
      .find(query, {
        projection: {
          _id: 1,
          COMPANY_NAME: 1,
          INVITE_CODE: 1,
          ABOUT_TEXT: 1,
          CoachingChatInteractionPoint: 1,
          LearningPlanInteractionPoint: 1,
          ReflectionInteractionPoint: 1,
          RoleplayInteractionPoint: 1,
          POINTSSTREAKPERDAY: 1,
          status: 1,
        },
      })
      .sort(sort)
      .toArray();

    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json({
      message: 'Companies retrieved successfully.',
      companies: companies,
    });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).json({ message: 'Internal server error while retrieving companies.' });
  }
};

export const companyChangePasswordController = async (req, res) => {
  try {
    const db = getDb();
    const { company_id, newPassword } = req.body;

    if (!company_id || !newPassword) {
      return res.status(400).json({ message: 'Invite code and new password are required.' });
    }

    const userCollection = db.collection('admin-users');

    const adminUser = await userCollection.findOne({
      companyId: company_id.toString(),
      role: 'company-admin',
    });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found for the given company.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await userCollection.updateOne(
      { _id: adminUser._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyDetailByIdController = async (req, res) => {
  try {
    const db = getDb();
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required.' });
    }

    const company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
    const users = await db.collection('users');
    const chatsCollection = await db.collection('chats');
    const rolePlayChatsCollection = await db.collection('role-play-chats');
    const learningPlanCollection = await db.collection('learning-plans');
    const leadershipReportCollection = await db.collection('leadership-reports');
    const insightsCollection = await db.collection('insights');

    const userCollection = db.collection('admin-users');
    const adminUser = await userCollection.findOne({
      companyId: companyId,
      role: 'company-admin',
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    const allUsers = await users.find({ companyId: company.INVITE_CODE }).toArray();

    const userIds = allUsers.map((u) => u._id.toString());

    if (userIds.length > 0) {
      // Helper function to safely get aggregation result
      const getAggregationResult = (
        result,
        defaultValue = { overallTokensUsed: 0, overallPromptTokens: 0, overallCompletionTokens: 0 },
      ) => {
        return result && result.length > 0 ? result[0] : defaultValue;
      };

      // Helper function to safely get value with default
      const getValue = (obj, key, defaultValue = 0) => {
        return obj && typeof obj[key] === 'number' ? obj[key] : defaultValue;
      };

      // Execute all aggregations
      const [
        chatSessionResult,
        rolePlaySessionResult,
        leaderShipReportResult,
        learningPlanSessionResult,
        insightsReport,
      ] = await Promise.all([
        chatsCollection
          .aggregate([
            {
              $match: { user_id: { $in: userIds } },
            },
            { $unwind: '$chat_context' },
            {
              $match: {
                'chat_context.from': 'aicoach',
              },
            },
            {
              $group: {
                _id: '$user_id',
                totalTokensUsed: { $sum: '$chat_context.tokensUsed' },
                totalPromptToken: { $sum: '$chat_context.promptToken' },
                totalCompletionToken: { $sum: '$chat_context.completionToken' },
                totalResponseTimeMs: { $sum: '$chat_context.responseTimeMs' },
              },
            },
            {
              $group: {
                _id: null,
                overallTokensUsed: { $sum: '$totalTokensUsed' },
                overallPromptTokens: { $sum: '$totalPromptToken' },
                overallCompletionTokens: { $sum: '$totalCompletionToken' },
              },
            },
          ])
          .toArray(),

        rolePlayChatsCollection
          .aggregate([
            {
              $match: { user_id: { $in: userIds } },
            },
            { $unwind: '$chat_context' },
            {
              $match: {
                'chat_context.from': 'aicoach',
              },
            },
            {
              $group: {
                _id: '$user_id',
                totalTokensUsed: { $sum: '$chat_context.tokensUsed' },
                totalPromptToken: { $sum: '$chat_context.promptToken' },
                totalCompletionToken: { $sum: '$chat_context.completionToken' },
                totalResponseTimeMs: { $sum: '$chat_context.responseTimeMs' },
              },
            },
            {
              $group: {
                _id: null,
                overallTokensUsed: { $sum: '$totalTokensUsed' },
                overallPromptTokens: { $sum: '$totalPromptToken' },
                overallCompletionTokens: { $sum: '$totalCompletionToken' },
              },
            },
          ])
          .toArray(),

        leadershipReportCollection
          .aggregate([
            {
              $match: { userId: { $in: userIds } },
            },
            {
              $group: {
                _id: null,
                overallTokensUsed: { $sum: '$tokensUsed' },
                overallPromptTokens: { $sum: '$promptToken' },
                overallCompletionTokens: { $sum: '$completionToken' },
              },
            },
          ])
          .toArray(),

        learningPlanCollection
          .aggregate([
            {
              $match: { userId: { $in: userIds } },
            },
            {
              $group: {
                _id: null,
                overallTokensUsed: { $sum: '$tokensUsed' },
                overallPromptTokens: { $sum: '$promptToken' },
                overallCompletionTokens: { $sum: '$completionToken' },
              },
            },
          ])
          .toArray(),

        insightsCollection
          .aggregate([
            {
              $match: { userId: { $in: userIds } },
            },
            {
              $group: {
                _id: null,
                overallTokensUsed: { $sum: '$tokensUsed' },
                overallPromptTokens: { $sum: '$promptToken' },
                overallCompletionTokens: { $sum: '$completionToken' },
              },
            },
          ])
          .toArray(),
      ]);

      // Get safe results
      const chatTokens = getAggregationResult(chatSessionResult);
      const rolePlayTokens = getAggregationResult(rolePlaySessionResult);
      const leadershipTokens = getAggregationResult(leaderShipReportResult);
      const learningPlanTokens = getAggregationResult(learningPlanSessionResult);
      const insightsTokens = getAggregationResult(insightsReport);

      // Calculate totals
      const totalTokensUsed =
        getValue(chatTokens, 'overallTokensUsed') +
        getValue(rolePlayTokens, 'overallTokensUsed') +
        getValue(leadershipTokens, 'overallTokensUsed') +
        getValue(learningPlanTokens, 'overallTokensUsed') +
        getValue(insightsTokens, 'overallTokensUsed');

      const totalPromptTokens =
        getValue(chatTokens, 'overallPromptTokens') +
        getValue(rolePlayTokens, 'overallPromptTokens') +
        getValue(leadershipTokens, 'overallPromptTokens') +
        getValue(learningPlanTokens, 'overallPromptTokens') +
        getValue(insightsTokens, 'overallPromptTokens');

      const totalCompletionTokens =
        getValue(chatTokens, 'overallCompletionTokens') +
        getValue(rolePlayTokens, 'overallCompletionTokens') +
        getValue(leadershipTokens, 'overallCompletionTokens') +
        getValue(learningPlanTokens, 'overallCompletionTokens') +
        getValue(insightsTokens, 'overallCompletionTokens');

      // Structure token data for frontend
      const tokenAnalytics = {
        total: {
          title: 'Total Usage',
          description: 'Combined token usage across all features',
          tokensUsed: totalTokensUsed,
          promptTokens: totalPromptTokens,
          completionTokens: totalCompletionTokens,
        },
        chat: {
          title: 'AI Coaching Chat',
          description: 'Token usage in coaching conversations',
          tokensUsed: getValue(chatTokens, 'overallTokensUsed'),
          promptTokens: getValue(chatTokens, 'overallPromptTokens'),
          completionTokens: getValue(chatTokens, 'overallCompletionTokens'),
        },
        roleplay: {
          title: 'Role Play Sessions',
          description: 'Token usage in role-playing scenarios',
          tokensUsed: getValue(rolePlayTokens, 'overallTokensUsed'),
          promptTokens: getValue(rolePlayTokens, 'overallPromptTokens'),
          completionTokens: getValue(rolePlayTokens, 'overallCompletionTokens'),
        },
        learningPlan: {
          title: 'Learning Plans',
          description: 'Token usage in learning plan generation',
          tokensUsed: getValue(learningPlanTokens, 'overallTokensUsed'),
          promptTokens: getValue(learningPlanTokens, 'overallPromptTokens'),
          completionTokens: getValue(learningPlanTokens, 'overallCompletionTokens'),
        },
        leadershipReport: {
          title: 'Leadership Reports',
          description: 'Token usage in leadership assessment reports',
          tokensUsed: getValue(leadershipTokens, 'overallTokensUsed'),
          promptTokens: getValue(leadershipTokens, 'overallPromptTokens'),
          completionTokens: getValue(leadershipTokens, 'overallCompletionTokens'),
        },
        insights: {
          title: 'Team & Manager Insights',
          description: 'Token usage in insights generation',
          tokensUsed: getValue(insightsTokens, 'overallTokensUsed'),
          promptTokens: getValue(insightsTokens, 'overallPromptTokens'),
          completionTokens: getValue(insightsTokens, 'overallCompletionTokens'),
        },
      };

      res.status(200).json({
        message: 'Company details retrieved successfully.',
        company: {
          ...company,
          hr_email: adminUser?.email,
          hr_id: adminUser?._id,
          hr_firstName: adminUser?.firstName,
        },
        tokenAnalytics,
      });
    } else {
      res.status(200).json({
        message: 'Company details retrieved successfully.',
        company: {
          ...company,
          hr_email: adminUser?.email,
          hr_id: adminUser?._id,
          hr_firstName: adminUser?.firstName,
        },
        tokenAnalytics: {
          total: {
            title: 'Total Usage',
            description: 'Combined token usage across all features',
            tokensUsed: 0,
            promptTokens: 0,
            completionTokens: 0,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error retrieving company details:', error);
    res.status(500).json({ message: 'Internal server error while retrieving company details.' });
  }
};

export const companyDetailsWithTokenController = async (req, res) => {
  try {
    const db = getDb();

    const { search = '', sortBy = 'COMPANY_NAME', sortOrder = 'asc' } = req.query;

    const query = {};

    if (search) {
      query.COMPANY_NAME = { $regex: search, $options: 'i' };
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const companies = await db
      .collection('companies')
      .find(query, {
        projection: {
          _id: 1,
          COMPANY_NAME: 1,
          INVITE_CODE: 1,
          CoachingChatInteractionPoint: 1,
          LearningPlanInteractionPoint: 1,
          ReflectionInteractionPoint: 1,
          RoleplayInteractionPoint: 1,
          POINTSSTREAKPERDAY: 1,
          status: 1
        },
      })
      .sort(sort)
      .toArray();

    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    const usersCollection = db.collection('users');
    const chatsCollection = db.collection('chats');
    const rolePlayChatsCollection = db.collection('role-play-chats');
    const learningPlanCollection = db.collection('learning-plans');
    const leadershipReportCollection = db.collection('leadership-reports');
    const insightsCollection = db.collection('insights');
    const adminUsersCollection = db.collection('admin-users');

    const getAggregationResult = (
      result,
      defaultValue = { overallTokensUsed: 0, overallPromptTokens: 0, overallCompletionTokens: 0 },
    ) => (result && result.length > 0 ? result[0] : defaultValue);

    const getValue = (obj, key, defaultValue = 0) =>
      obj && typeof obj[key] === 'number' ? obj[key] : defaultValue;

    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const companyId = company._id.toString();
        const inviteCode = company.INVITE_CODE;

        const adminUser = await adminUsersCollection.findOne({
          companyId: companyId,
          role: 'company-admin',
        });

        const allUsers = await usersCollection.find({ companyId: inviteCode }).toArray();

        const userIds = allUsers.map((u) => u._id.toString());

        let tokenAnalytics = {
          total: {
            tokensUsed: 0,
            promptTokens: 0,
            completionTokens: 0,
          },
        };

        let chatTokens;
        let rolePlayTokens;
        let leadershipTokens;
        let learningPlanTokens;
        let insightsTokens;

        if (userIds.length > 0) {
          const [
            chatSessionResult,
            rolePlaySessionResult,
            leaderShipReportResult,
            learningPlanSessionResult,
            insightsReport,
          ] = await Promise.all([
            chatsCollection
              .aggregate([
                { $match: { user_id: { $in: userIds } } },
                { $unwind: '$chat_context' },
                { $match: { 'chat_context.from': 'aicoach' } },
                {
                  $group: {
                    _id: '$user_id',
                    totalTokensUsed: { $sum: '$chat_context.tokensUsed' },
                    totalPromptToken: { $sum: '$chat_context.promptToken' },
                    totalCompletionToken: { $sum: '$chat_context.completionToken' },
                  },
                },
                {
                  $group: {
                    _id: null,
                    overallTokensUsed: { $sum: '$totalTokensUsed' },
                    overallPromptTokens: { $sum: '$totalPromptToken' },
                    overallCompletionTokens: { $sum: '$totalCompletionToken' },
                  },
                },
              ])
              .toArray(),

            rolePlayChatsCollection
              .aggregate([
                { $match: { user_id: { $in: userIds } } },
                { $unwind: '$chat_context' },
                { $match: { 'chat_context.from': 'aicoach' } },
                {
                  $group: {
                    _id: '$user_id',
                    totalTokensUsed: { $sum: '$chat_context.tokensUsed' },
                    totalPromptToken: { $sum: '$chat_context.promptToken' },
                    totalCompletionToken: { $sum: '$chat_context.completionToken' },
                  },
                },
                {
                  $group: {
                    _id: null,
                    overallTokensUsed: { $sum: '$totalTokensUsed' },
                    overallPromptTokens: { $sum: '$totalPromptToken' },
                    overallCompletionTokens: { $sum: '$totalCompletionToken' },
                  },
                },
              ])
              .toArray(),

            leadershipReportCollection
              .aggregate([
                { $match: { userId: { $in: userIds } } },
                {
                  $group: {
                    _id: null,
                    overallTokensUsed: { $sum: '$tokensUsed' },
                    overallPromptTokens: { $sum: '$promptToken' },
                    overallCompletionTokens: { $sum: '$completionToken' },
                  },
                },
              ])
              .toArray(),

            learningPlanCollection
              .aggregate([
                { $match: { userId: { $in: userIds } } },
                {
                  $group: {
                    _id: null,
                    overallTokensUsed: { $sum: '$tokensUsed' },
                    overallPromptTokens: { $sum: '$promptToken' },
                    overallCompletionTokens: { $sum: '$completionToken' },
                  },
                },
              ])
              .toArray(),

            insightsCollection
              .aggregate([
                { $match: { userId: { $in: userIds } } },
                {
                  $group: {
                    _id: null,
                    overallTokensUsed: { $sum: '$tokensUsed' },
                    overallPromptTokens: { $sum: '$promptToken' },
                    overallCompletionTokens: { $sum: '$completionToken' },
                  },
                },
              ])
              .toArray(),
          ]);

          chatTokens = getAggregationResult(chatSessionResult);
          rolePlayTokens = getAggregationResult(rolePlaySessionResult);
          leadershipTokens = getAggregationResult(leaderShipReportResult);
          learningPlanTokens = getAggregationResult(learningPlanSessionResult);
          insightsTokens = getAggregationResult(insightsReport);

          tokenAnalytics.total.tokensUsed =
            getValue(chatTokens, 'overallTokensUsed') +
            getValue(rolePlayTokens, 'overallTokensUsed') +
            getValue(leadershipTokens, 'overallTokensUsed') +
            getValue(learningPlanTokens, 'overallTokensUsed') +
            getValue(insightsTokens, 'overallTokensUsed');

          tokenAnalytics.total.promptTokens =
            getValue(chatTokens, 'overallPromptTokens') +
            getValue(rolePlayTokens, 'overallPromptTokens') +
            getValue(leadershipTokens, 'overallPromptTokens') +
            getValue(learningPlanTokens, 'overallPromptTokens') +
            getValue(insightsTokens, 'overallPromptTokens');

          tokenAnalytics.total.completionTokens =
            getValue(chatTokens, 'overallCompletionTokens') +
            getValue(rolePlayTokens, 'overallCompletionTokens') +
            getValue(leadershipTokens, 'overallCompletionTokens') +
            getValue(learningPlanTokens, 'overallCompletionTokens') +
            getValue(insightsTokens, 'overallCompletionTokens');
        }
        debugger;

        return {
          ...company,
          hr_email: adminUser?.email || null,
          hr_id: adminUser?._id || null,
          hr_firstName: adminUser?.firstName || null,
          tokenAnalytics,
          chatTokens,
          rolePlayTokens,
          leadershipTokens,
          learningPlanTokens,
          insightsTokens,
        };
      }),
    );

    res.status(200).json({
      message: 'Companies with token analytics retrieved successfully.',
      companies: enrichedCompanies,
    });
  } catch (error) {
    console.error('Error retrieving companies with tokens:', error);
    res.status(500).json({
      message: 'Internal server error while retrieving companies with tokens.',
    });
  }
};

export const companyEditTextController = async (req, res) => {
  try {
    const db = getDb();
    const { company_id, newText } = req.body;

    if (!company_id || !newText) {
      return res.status(400).json({ message: 'Invite code and newText are required.' });
    }

    const companyCollection = db.collection('companies');

    // Update the password
    await companyCollection.updateOne(
      { _id: new ObjectId(company_id) },
      {
        $set: {
          ABOUT_TEXT: newText,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'About Text updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyEditHrEmailController = async (req, res) => {
  try {
    const db = getDb();
    const { user_id, newEmail } = req.body;

    if (!user_id || !newEmail) {
      return res.status(400).json({ message: 'user id and newEmail are required.' });
    }

    const userCollection = db.collection('admin-users');

    // Update the password
    await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email: newEmail,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'Email updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyChangeStatusController = async (req, res) => {
  try {
    const db = getDb();
    const companyCollection = db.collection('companies');

    const { status } = req.body;
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    // Validate status input
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Status must be a boolean value' });
    }

    const company = await companyCollection.findOne({ _id: new ObjectId(id) });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updatedStatus = status ? 'active' : 'inactive';

    const updateResult = await companyCollection.updateOne(
      { _id: company._id },
      { $set: { status: updatedStatus } },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update user status' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      company: {
        _id: company._id,
        status: updatedStatus,
      },
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
