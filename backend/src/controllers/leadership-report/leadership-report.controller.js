import generateLeadershipAssessment from "../../helper/leadership-report/generateLeadershipAssessment.js";
import { leadershipReportSchema } from "../../validators/leadership-report.js";
import { getDb } from '../../config/db.js';

export const leadershipReportControllers = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('leadership-reports');

    // Validate request body
    leadershipReportSchema.parse(req.body);

    // Generate leadership assessment
    const leadershipAssessment = await generateLeadershipAssessment(req.body);

    // Create report document with user details and timestamp
    const reportDocument = {
      userId: req.user.id,
      userEmail: req.user.email,
      assessment: leadershipAssessment,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save report to database
    const result = await leadershipReportsCollection.insertOne(reportDocument);

    // Return success response with saved report
    return res.status(200).json({
      status: 'OK',
      data: {
        reportId: result.insertedId,
        ...leadershipAssessment
      }
    });
  } catch (error) {
    console.error('Leadership Report Error:', error);
    return res.status(400).json({ 
      status: 'Not OK', 
      error: error.errors || 'Failed to generate or save leadership report' 
    });
  }
};
