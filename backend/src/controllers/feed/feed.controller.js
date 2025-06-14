import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../../utils/logger.js';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

export const changeGoalStatus = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('learning-plans');
    const userId = req.user.id;
    const { title, saved } = req.body;

    if (!title || saved === undefined) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title and saved status are required',
      });
    }

    // Find the latest report and update the specific learning plan
    const result = await leadershipReportsCollection.updateOne(
      {
        userId: userId,
        'learning_plan.title': title,
      },
      {
        $set: {
          'learning_plan.$.saved': saved,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Learning plan not found',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Learning plan saved status updated successfully',
    });
  } catch (error) {
    console.error('Save Learning Plan Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to update learning plan saved status',
    });
  }
};

export const addGoalNotes = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('learning-plans');
    const userId = req.user.id;
    const { title, note } = req.body;

    if (!title || !note) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title and note are required',
      });
    }

    // Find the latest report and add the note to the specific learning plan
    const result = await leadershipReportsCollection.updateOne(
      {
        userId: userId,
        'learning_plan.title': title,
      },
      {
        $push: {
          'learning_plan.$.notes': note,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      {
        upsert: true, // This will create the notes array if it doesn't exist
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Learning plan not found',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Note added successfully',
    });
  } catch (error) {
    console.error('Add Note Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to add note to learning plan',
    });
  }
};

export const editGoalNote = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('learning-plans');
    const userId = req.user.id;
    const { title, updatedNote } = req.body;

    if (!title || !updatedNote) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title and updated note are required',
      });
    }

    // Update the note in the learning plan
    const result = await leadershipReportsCollection.updateOne(
      {
        userId: userId,
        'learning_plan.title': title,
      },
      {
        $set: {
          'learning_plan.$.notes': [updatedNote],
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Learning plan not found',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error('Edit Note Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to update note',
    });
  }
};

export const deleteGoalNote = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('learning-plans');
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title is required',
      });
    }

    // Remove all notes from the learning plan
    const result = await leadershipReportsCollection.updateOne(
      {
        userId: userId,
        'learning_plan.title': title,
      },
      {
        $set: {
          'learning_plan.$.notes': [],
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Learning plan not found',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete Note Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to delete note',
    });
  }
};

export const addReaction = async (req, res) => {
  try {
    const db = getDb();
    const leadershipReportsCollection = db.collection('learning-plans');
    const userId = req.user.id;
    const { title, reactionType, reactionValue } = req.body;

    if (!title || !reactionType || !['thumbsUp', 'thumbsDown'].includes(reactionType)) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title and valid reaction type are required',
      });
    }

    // Find the learning plan and update its reactions
    const result = await leadershipReportsCollection.updateOne(
      {
        userId: userId,
        'learning_plan.title': title,
      },
      {
        $set: {
          [`learning_plan.$.reactions.${reactionType}`]: reactionValue,
          [`learning_plan.$.reactions.${reactionType === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp'}`]: false,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Learning plan not found',
      });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Reaction added successfully',
    });
  } catch (error) {
    console.error('Add Reaction Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to add reaction',
    });
  }
};

export const getUserPoints = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const interactionsCollection = db.collection('users');

    // Get the user's interaction document
    const interaction = await interactionsCollection.findOne({ _id: new ObjectId(userId) });

    const points = interaction ? interaction.totalPoints : 0;

    return res.status(200).json({
      status: 'OK',
      points: points,
    });
  } catch (error) {
    console.error('Get Points Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch points',
    });
  }
};

export const interActWithFeedItemController = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Title is required',
      });
    }

    // Fetch user
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user || !user.companyId) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'User or company ID not found',
      });
    }

    const companyId = user.companyId;
    const pointsKey = `LearningPlanInteractionPoint_${companyId}`;
    const points = parseInt(process.env[pointsKey]) || 0;

    if (!points) {
      console.warn(`No points configuration found for ${pointsKey}`);
    }

    const interactionsCollection = db.collection('interactions');

    // Record the new interaction as a separate event
    const interactionDoc = {
      user_id: userId,
      interaction_type: 'LEARNING',
      learning_plan_title: title,
      points: points,
      interaction_timestamp: new Date(),
    };

    const result = await interactionsCollection.insertOne(interactionDoc);

    // Emit total points (aggregate for user)
    const totalPoints = await interactionsCollection
      .aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ])
      .toArray();

    const updatedPoints = totalPoints[0]?.total || 0;

    // ✅ Update total points in users collection
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { totalPoints: updatedPoints } },
    );

    // Emit to connected SSE clients if any
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    // Log event
    const logMetadata = {
      userId,
      userEmail: user.email,
      companyId,
      learningPlanTitle: title,
      pointsAwarded: points,
      interactionType: 'LEARNING',
      totalPoints: updatedPoints,
      timestamp: new Date().toISOString(),
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Learning Plan Interaction recorded (event model)', logMetadata);

    return res.status(200).json({
      status: 'OK',
      message: 'Interaction recorded successfully',
      points: updatedPoints,
    });
  } catch (error) {
    console.error('Interaction Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to record interaction',
    });
  }
};
