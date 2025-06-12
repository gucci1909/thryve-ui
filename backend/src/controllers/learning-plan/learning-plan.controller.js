import { getDb } from '../../config/db.js';
import generateLearningPlan from '../../helper/learning-plan/generateLearningPlan.js';
import logger from '../../utils/logger.js';

export const learningPlanController = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    // Get all required collections
    const leadershipReportsCollection = db.collection('leadership-reports');
    const chatsCollection = db.collection('chats');
    const teamMembersCollection = db.collection('team_members');
    const reflectionsCollection = db.collection('reflections');
    const learningPlansCollection = db.collection('learning-plans');

    // Fetch all required data
    const leadershipReport = await leadershipReportsCollection.findOne({ userId });
    const existingLearningPlans = await learningPlansCollection.findOne({ userId });
    const chats = await chatsCollection.findOne({ user_id: userId });
    const teamMembers = await teamMembersCollection.find({ userId }).toArray();
    const reflections = await reflectionsCollection.find({ userId }).toArray();

    // Prepare input for the learning plan generator
    // const inputJson = {
    //   past_learning_cards: existingLearningPlans.map(plan => ({
    //     title: plan.title,
    //     content: plan.content,
    //     video: plan.video
    //   })),
    //   team_feedback: teamMembers.map(member => ({
    //     rating: member.feedbackData?.rating,
    //     feedback: member.feedbackData?.feedback,
    //     area: member.feedbackData?.area
    //   })).filter(feedback => feedback.rating && feedback.feedback),
    //   coaching_history: chats?.chat_context?.map(chat => ({
    //     question: chat.chat_text,
    //     response: chat.response,
    //     timestamp: chat.timestamp
    //   })) || [],
    //   reflections: reflections.map(reflection => ({
    //     content: reflection.content,
    //     timestamp: reflection.timestamp,
    //     tags: reflection.tags || []
    //   })),
    //   leadership_assessment: leadershipReport?.assessment || {},
    //   youtube_videos: [] // This should be populated from your master list
    // };

    const past_learning_cards = [
      ...(existingLearningPlans?.learning_plan || []),
      ...(leadershipReport?.assessment?.learning_plan || [])
    ];

    const team_feedback = teamMembers.filter(feedback => feedback.feedbackData);

    const coaching_history = chats?.chat_context || [];

    const reflections_of_context = reflections.map(reflection => ({
      content: reflection.content,  
    }));
    
    // Generate new learning plan
    const generatedPlan = await generateLearningPlan(past_learning_cards, team_feedback, coaching_history, reflections_of_context, leadershipReport?.assessment);

    // Save the generated plan
    const result = await learningPlansCollection.insertOne({
      userId,
      ...generatedPlan,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Log the event
    const logMetadata = {
      userId,
      userEmail: req.user.email,
      learningPlanId: result.insertedId,
      timestamp: new Date().toISOString()
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Learning Plan Generated', logMetadata);

    return res.status(200).json({
      status: 'OK',
      data: generatedPlan
    });

  } catch (error) {
    console.error('Learning Plan Generation Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.message || 'Failed to generate learning plan'
    });
  }
};

export const learningPlanGetController = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    const learningPlansCollection = db.collection('learning-plans');

    // Get the latest learning plan for the user
    const latestPlan = await learningPlansCollection
      .find({ userId })
      .sort({ created_at: -1 })
      .limit(1)
      .toArray();

    if (!latestPlan || latestPlan.length === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'No learning plan found'
      });
    }

    return res.status(200).json({
      status: 'OK',
      data: latestPlan[0]
    });

  } catch (error) {
    console.error('Get Learning Plan Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.message || 'Failed to get learning plan'
    });
  }
};
