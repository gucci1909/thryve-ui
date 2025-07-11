// import cron from 'node-cron';
// import { getDb } from '../../config/db.js';
// import generateLearningPlan from '../../helper/learning-plan/generateLearningPlan.js';
// import logger from '../../utils/logger.js';

// // Batch size for processing users
// const BATCH_SIZE = 50;
// const MAX_RETRIES = 3;
// const RETRY_DELAY = 5000;

// async function processUserBatch(users, db) {
//   const results = {
//     success: [],
//     failed: [],
//   };

//   for (const user of users) {
//     try {
//       // Get all required collections
//       const leadershipReportsCollection = db.collection('leadership-reports');
//       const chatsCollection = db.collection('chats');
//       const rolePlayChatCollection = db.collection('role-play-chats');
//       const teamMembersCollection = db.collection('team-members');
//       const reflectionsCollection = db.collection('reflections');
//       const learningPlansCollection = db.collection('learning-plans');

//       // Fetch all required data
//       const leadershipReport = await leadershipReportsCollection.findOne({
//         userId: user._id.toString(),
//       });

//       const existingChat = await chatsCollection
//         .find({ user_id: user._id.toString() })
//         .sort({ updated_at: -1 })
//         .toArray();
//       const existingRolePlayChat = await rolePlayChatCollection
//         .find({ user_id: user._id.toString() })
//         .sort({ updated_at: -1 })
//         .toArray();
//       const teamMembers = await teamMembersCollection
//         .find({ userId: user._id.toString() })
//         .toArray();
//       const reflections = await reflectionsCollection
//         .find({ userId: user._id.toString() })
//         .toArray();
//       const existingLearningPlans = await learningPlansCollection
//         .find({ userId: user._id.toString() })
//         .sort({ updated_at: -1 })
//         .toArray();

//       const mergedLearningPlan = existingLearningPlans?.reduce((acc, existingLearningPlan) => {
//         return acc.concat(existingLearningPlan?.learning_plan);
//       }, []);

//       const past_learning_cards = [
//         ...(mergedLearningPlan || []),
//         ...(leadershipReport?.assessment?.learning_plan || []),
//       ];

//       const mergedExistingChat = existingChat?.reduce((acc, chat) => {
//         return acc.concat(chat.chat_context);
//       }, []);

//       const mergedExistingRolePlayChat = existingRolePlayChat?.reduce((acc, chat) => {
//         return acc.concat(chat?.chat_context);
//       }, []);

//       const team_feedback = teamMembers
//         .filter((member) => member.feedbackData !== undefined)
//         .map((member) => member.feedbackData);
//       const coaching_history = {
//         chat_context: [
//           ...(Array.isArray(mergedExistingChat) ? mergedExistingChat : []),
//           ...(Array.isArray(mergedExistingRolePlayChat) ? mergedExistingRolePlayChat : []),
//         ],
//       };
//       const reflections_of_context = reflections.map((reflection) => ({
//         content: reflection.content,
//       }));

//       // Generate new learning plan
//       const generatedPlan = await generateLearningPlan(
//         past_learning_cards,
//         team_feedback,
//         coaching_history,
//         reflections_of_context,
//         leadershipReport?.assessment,
//       );

//       // Save the generated plan
//       await learningPlansCollection.insertOne({
//         userId: user._id.toString(),
//         userEmail: user.email,
//         learning_plan: generatedPlan?.learningPlan,
//         ...(generatedPlan?.openAICollection || {}),
//         created_at: new Date(),
//         updated_at: new Date(),
//       });

//       results.success.push(user._id);

//       logger.info('Learning Plan Generated for user', {
//         userId: user._id,
//         userEmail: user.email,
//         timestamp: new Date().toISOString(),
//       });
//     } catch (error) {
//       logger.error('Failed to generate learning plan for user', {
//         userId: user._id,
//         error: error.message,
//         timestamp: new Date().toISOString(),
//       });
//       results.failed.push(user._id);
//     }
//   }

//   return results;
// }

// async function updateAllUsersLearningPlans() {
//   const db = getDb();
//   const usersCollection = db.collection('users');
//   let processedCount = 0;
//   let totalSuccess = 0;
//   let totalFailed = 0;

//   try {
//     logger.info('Starting daily learning plan update job', {
//       timestamp: new Date().toISOString(),
//     });

//     // Get total count of users
//     const totalUsers = await usersCollection.countDocuments();

//     // Process users in batches
//     while (processedCount < totalUsers) {
//       const users = await usersCollection.find({}).skip(processedCount).limit(BATCH_SIZE).toArray();

//       if (users.length === 0) break;

//       const results = await processUserBatch(users, db);
//       totalSuccess += results.success.length;
//       totalFailed += results.failed.length;
//       processedCount += users.length;

//       logger.info('Batch processing progress', {
//         processed: processedCount,
//         total: totalUsers,
//         success: totalSuccess,
//         failed: totalFailed,
//         timestamp: new Date().toISOString(),
//       });

//       // Add a small delay between batches to prevent overwhelming the system
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }

//     logger.info('Completed daily learning plan update job', {
//       totalProcessed: processedCount,
//       totalSuccess,
//       totalFailed,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     logger.error('Critical error in daily learning plan update job', {
//       error: error.message,
//       timestamp: new Date().toISOString(),
//     });
//     throw error;
//   }
// }

// // Schedule the job to run at 4 PM daily
// cron.schedule(
//   '0 16 * * *',
//   async () => {
//     let retryCount = 0;

//     while (retryCount < MAX_RETRIES) {
//       try {
//         await updateAllUsersLearningPlans();
//         break;
//       } catch (error) {
//         retryCount++;
//         if (retryCount === MAX_RETRIES) {
//           logger.error('Daily learning plan update job failed after maximum retries', {
//             error: error.message,
//             retryCount,
//             timestamp: new Date().toISOString(),
//           });
//         } else {
//           logger.warn('Retrying daily learning plan update job', {
//             retryCount,
//             error: error.message,
//             timestamp: new Date().toISOString(),
//           });
//           await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
//         }
//       }
//     }
//   },
//   {
//     scheduled: true,
//     timezone: 'Asia/Kolkata',
//   },
// );

// // Export for testing purposes
// export { updateAllUsersLearningPlans };
