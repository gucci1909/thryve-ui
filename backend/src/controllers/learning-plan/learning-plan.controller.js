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
    const rolePlayChatCollection = db.collection('role-play-chats');
    const teamMembersCollection = db.collection('team_members');
    const reflectionsCollection = db.collection('reflections');
    const learningPlansCollection = db.collection('learning-plans');

    // checking learning_plan exists for today or not
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const endOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
    );

    const alreadyExistLearningPlan = await learningPlansCollection.findOne({
      userId,
      created_at: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });

    if (alreadyExistLearningPlan) {
      return res.status(200).json({
        status: 'OK',
        data: {
          already_exists:
            'Your learning plan for today is ready! Feel free to review or continue with your existing plan.',
        },
      });
    }

    // end checking learning_plan exists for today or not

    // Fetch all required data
    const leadershipReport = await leadershipReportsCollection.findOne({
      userId,
    });

    const existingChat = await chatsCollection
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .toArray();
    const existingRolePlayChat = await rolePlayChatCollection
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .toArray();
    const teamMembers = await teamMembersCollection.find({ userId: userId }).toArray();
    const reflections = await reflectionsCollection.find({ userId: userId }).toArray();
    const existingLearningPlans = await learningPlansCollection
      .find({ userId: userId })
      .sort({ updated_at: -1 })
      .toArray();

    const mergedLearningPlan = existingLearningPlans?.reduce((acc, existingLearningPlan) => {
      return acc.concat(existingLearningPlan?.learning_plan);
    }, []);

    const past_learning_cards = [
      ...(mergedLearningPlan || []),
      ...(leadershipReport?.assessment?.learning_plan || []),
    ];

    const mergedExistingChat = existingChat?.reduce((acc, chat) => {
      return acc.concat(chat.chat_context);
    }, []);

    const mergedExistingRolePlayChat = existingRolePlayChat?.reduce((acc, chat) => {
      return acc.concat(chat?.chat_context);
    }, []);

    const team_feedback = teamMembers
      .filter((member) => member.feedbackData !== undefined)
      .map((member) => member.feedbackData);
    const coaching_history = {
      chat_context: [
        ...(Array.isArray(mergedExistingChat) ? mergedExistingChat : []),
        ...(Array.isArray(mergedExistingRolePlayChat) ? mergedExistingRolePlayChat : []),
      ],
    };
    const reflections_of_context = reflections.map((reflection) => ({
      content: reflection.content,
    }));

    // Generate new learning plan
    const generatedPlan = await generateLearningPlan(
      past_learning_cards,
      team_feedback,
      coaching_history,
      reflections_of_context,
      leadershipReport?.assessment,
      req,
    );

    // Save the generated plan
    await learningPlansCollection.insertOne({
      userId: userId,
      userEmail: req.user.email,
      learning_plan: generatedPlan?.learningPlan,
      ...(generatedPlan?.openAICollection || {}),
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Log the event
    const logMetadata = {
      userId,
      userEmail: req.user.email,
      timestamp: new Date().toISOString(),
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Learning Plan Generated', logMetadata);

    return res.status(200).json({
      status: 'OK',
      data: {
        learning_plan: generatedPlan?.learningPlan,
      },
    });
  } catch (error) {
    console.error('Learning Plan Generation Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.message || 'Failed to generate learning plan',
    });
  }
};

export const learningPlanGetController = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    const learningPlansCollection = db.collection('learning-plans');

    // Get the latest learning plan for the user
    const plans = await learningPlansCollection.find({ userId }).sort({ updated_at: -1 }).toArray();

    if (!plans || plans.length === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'No learning plan found',
      });
    }

    // Merge learning_plan arrays while keeping latest plans first
    const mergedLearningPlan = plans.reduce((acc, plan) => {
      return acc.concat(plan.learning_plan);
    }, []);

    // const seenVideos = [];

    // const mergedLearningPlan = plans.reduce((acc, plan) => {
    //   plan.learning_plan.forEach((item) => {
    //     if (!seenVideos.includes(item.video)) {
    //       seenVideos.push(item.video);
    //       acc.push(item);
    //     }
    //   });
    //   return acc;
    // }, []);

    if (plans.length === 1 && plans[0].coming_from_leadership_report) {
      const now = new Date();
      const startOfToday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
      const endOfToday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
      );

      const alreadyExistLearningPlan = await learningPlansCollection.findOne({
        userId,
        created_at: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      });
      return res.status(200).json({
        status: 'OK',
        data: {
          learning_plan: mergedLearningPlan,
          coming_from_leadership_report: alreadyExistLearningPlan ? true : false,
        },
      });
    } else {
      return res.status(200).json({
        status: 'OK',
        data: {
          learning_plan: mergedLearningPlan,
        },
      });
    }
  } catch (error) {
    console.error('Get Learning Plan Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.message || 'Failed to get learning plan',
    });
  }
};
