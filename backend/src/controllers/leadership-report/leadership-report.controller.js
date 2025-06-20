import generateLeadershipAssessment from '../../helper/leadership-report/generateLeadershipAssessment.js';
import { leadershipReportSchema } from '../../validators/leadership-report.js';
import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const leadershipReportControllers = async (req, res) => {
  try {
    const db = getDb();
    const { userId } = req.body;
    const leadershipReportsCollection = db.collection('leadership-reports');
    const leadershipReportInfoCollections = db.collection('leadership-report-info');
    const learningPlanCollection = db.collection('learning-plans');
    const usersCollection = db.collection('users');

    // 1. Validate request body
    leadershipReportSchema.parse(req.body?.formData);

    // 2. Generate leadership assessment
    const leadershipAssessment = await generateLeadershipAssessment(req.body?.formData, req);

    console.dir(leadershipAssessment, { depth: null, colors: true });

    // 3. Destructure learning_plan from assessment
    const { learning_plan, ...restOfAssessment } = leadershipAssessment?.outputJson;

    // 4. Insert learning_plan into `learning-plans` collection
    if (learning_plan && Array.isArray(learning_plan) && learning_plan.length > 0) {
      await learningPlanCollection.insertOne({
        userId: req.user.id,
        userEmail: req.user.email,
        learning_plan: learning_plan,
        coming_from_leadership_report: true,
        ...(leadershipAssessment?.openAICollection || {}),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 5. Insert the rest of the assessment into `leadership-reports` collection
    await leadershipReportsCollection.insertOne({
      userId: req.user.id,
      userEmail: req.user.email,
      assessment: restOfAssessment,
      ...(leadershipAssessment?.openAICollection || {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await leadershipReportInfoCollections.insertOne({
      userId: req.user.id,
      userEmail: req.user.email,
      formData: req.body?.formData,
      fullReport: req.body?.fullReport,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      {
        $set: {
          personalized: true,
          updatedAt: new Date(),
        },
      },
    );

    // Check if user was actually updated
    if (updateResult.matchedCount === 0) {
      console.warn('No user found with id:', req.user.id);
    }

    // Return success response with saved report
    return res.status(200).json({
      status: 'OK',
      data: {
        ...restOfAssessment,
      },
    });
  } catch (error) {
    console.error('Leadership Report Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to generate or save leadership report',
    });
  }
};

export const leadershipReportRecommendationController = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('leadership-reports');

    // Get user ID from authenticated token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'User ID not found in token',
      });
    }

    // Find the latest leadership report for the user
    const userReport = await leadershipReportsCollection.findOne(
      { userId: userId },
      { sort: { createdAt: -1 } }, // Get the most recent report
    );

    if (!userReport) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'No leadership report found for this user',
      });
    }

    // Return the assessment data from the report
    return res.status(200).json({
      status: 'OK',
      data: {
        reportId: userReport._id,
        assessment: userReport.assessment,
      },
    });
  } catch (error) {
    console.error('Leadership Report Recommendation Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch leadership report recommendation',
    });
  }
};
