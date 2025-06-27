import { getDb } from '../../config/db.js';
import generateTeamAndManagerInsights from '../../helper/team-and-manager-insights/generateTeamAndManagerInsights.js';

export const createAndGetInsightsOfTeamAndManager = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const leadershipReportInfoCollections = db.collection('leadership-report-info');
    const teamMembersCollection = db.collection('team-members');
    const managerAndTeamInsightsCollections = db.collection('insights');

    const leadershipReport = await leadershipReportInfoCollections.findOne({ userId });

    // Get team members for this user
    const teamMembers = await teamMembersCollection
      .find({ userId: userId, assessment: true })
      .toArray();

    if (teamMembers.length === 0) {
      return res.status(200).json({
        status: 'OK',
        pending_result:
          "Your team members haven't provided feedback yet. Once they do, your managerial and team insights will appear here.",
      });
    }

    const managerAndTeamInsights = await managerAndTeamInsightsCollections.findOne({ userId });

    if (
      !managerAndTeamInsights ||
      managerAndTeamInsights.teamMembersLength !== teamMembers.length
    ) {
      const feedback_ratings_team_members = teamMembers
        .filter((member) => member?.feedbackData?.ratingQuestions?.length > 0)
        .map((member, index) => ({
          teamMember: `team-member-${index + 1}`,
          ratingQuestions: member.feedbackData?.ratingQuestions?.map((question) => ({
            category: question?.category,
            text: question?.text,
            response: question?.response,
          })),
        }));

      const feedback_ratings_manager = leadershipReport?.formData?.sections?.leadership || {};

      const insights = await generateTeamAndManagerInsights(
        feedback_ratings_manager,
        feedback_ratings_team_members,
        req,
      );

      const parsedInsights = JSON.parse(insights?.outputText);
      const now = new Date();

      await managerAndTeamInsightsCollections.updateOne(
        { userId },
        {
          $set: {
            userId,
            insightsFromTeamToManager: parsedInsights?.insightsFromTeamToManager,
            managerInsights: parsedInsights?.managerInsights,
            ...(insights?.openAICollection || {}),
            teamMembersLength: teamMembers.length,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true },
      );

      return res.status(200).json({
        status: 'OK',
        insightsFromTeamToManager: parsedInsights?.insightsFromTeamToManager,
        managerInsights: parsedInsights?.managerInsights,
      });
    } else {
      return res.status(200).json({
        status: 'OK',
        insightsFromTeamToManager: managerAndTeamInsights.insightsFromTeamToManager,
        managerInsights: managerAndTeamInsights?.managerInsights,
      });
    }
  } catch (error) {
    console.error('Create And Get Insights Of Team And Manager Failed:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to Create And Get Insights Of Team And Manager Failed',
    });
  }
};

export const getScoresOfTeamAndManager = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const leadershipReportInfoCollections = db.collection('leadership-report-info');
    const teamMembersCollection = db.collection('team-members');

    // Get leadership report info for this user
    const leadershipReport = await leadershipReportInfoCollections.findOne({ userId });

    // Get team members for this user
    const teamMembers = await teamMembersCollection
      .find({ userId: userId, assessment: true })
      .toArray();

    if (teamMembers.length === 0) {
      return res.status(200).json({
        status: 'OK',
        pending_result:
          "Your team members haven't provided feedback yet. Once they do, your managerial and team feedback scores will appear here.",
      });
    }

    const categoryTotals = {};
    let totalMembers = teamMembers.length;

    teamMembers.forEach((member) => {
      const scores = member?.scores_of_manager_feedback || {};

      for (const [category, score] of Object.entries(scores)) {
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += score;
      }
    });

    const categoryAverages = {};
    for (const [category, total] of Object.entries(categoryTotals)) {
      categoryAverages[category] = total / totalMembers;
    }

    // Define the key mapping
    const keyMapping = {
      CommunicationClarity: 'Communication & Clarity',
      SupportDevelopment: 'Support & Development',
      DecisionMakingFairness: 'Decision-Making & Fairness',
      RecognitionTeamCulture: 'Recognition & Team Culture',
      EmpowermentMotivation: 'Empowerment & Motivation',
    };

    // Map manager scores keys to match team scores keys
    const mappedManagerScores = {};
    const managerScores = leadershipReport?.scores_of_leadership_assessment || {};

    for (const [key, value] of Object.entries(managerScores)) {
      const mappedKey = keyMapping[key] || key; // fallback if any unmapped key appears
      mappedManagerScores[mappedKey] = value;
    }

    return res.status(200).json({
      status: 'OK',
      scores_from_manager: mappedManagerScores || {},
      scores_from_team: categoryAverages,
    });
  } catch (error) {
    console.error('Get leadership Scores Of Team And Manager Failed:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to Get Scores Of Team And Manager',
    });
  }
};

export const getNPSScoresOfTeamAndCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const teamMembersCollection = db.collection('team-members');

    const managerTeamMembers = await teamMembersCollection
      .find({ userId, assessment: true })
      .toArray();

    if (managerTeamMembers.length === 0) {
      return res.status(200).json({
        status: 'OK',
        pending_result:
          "Your team members haven't provided feedback yet. Once they do, your managerial NPS comparison will appear here.",
      });
    }

    // Compute manager's NPS
    let promoters = 0;
    let detractors = 0;
    let validResponses = 0;

    managerTeamMembers.forEach((member) => {
      const score = member?.feedbackData?.npsScore;
      if (typeof score === 'number') {
        validResponses++;
        if (score >= 9) promoters++;
        else if (score <= 6) detractors++;
      }
    });

    const averageManagerNpsScore =
      validResponses > 0 ? ((promoters - detractors) / validResponses) * 100 : 0;

    // Compute company-wide NPS
    const companyTeamMembers = await teamMembersCollection
      .aggregate([
        {
          $match: {
            assessment: true,
            companyCode: managerTeamMembers[0]?.companyCode,
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

    return res.status(200).json({
      status: 'OK',
      scores_from_team_nps: averageManagerNpsScore.toFixed(2),
      scores_from_company_nps: companyAverageNps.toFixed(2),
    });
  } catch (error) {
    console.error('Get NPS Scores Of Team And Company Failed:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to Get NPS Scores Of Team And Company',
    });
  }
};
