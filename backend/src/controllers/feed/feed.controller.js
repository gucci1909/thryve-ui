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
    const leadershipReportsCollection = db.collection('leadership-reports');
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
        'assessment.learning_plan.title': title,
      },
      {
        $set: {
          'assessment.learning_plan.$.saved': saved,
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
    const leadershipReportsCollection = db.collection('leadership-reports');
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
        'assessment.learning_plan.title': title,
      },
      {
        $push: {
          'assessment.learning_plan.$.notes': note,
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
    const leadershipReportsCollection = db.collection('leadership-reports');
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
        'assessment.learning_plan.title': title,
      },
      {
        $set: {
          'assessment.learning_plan.$.notes': [updatedNote],
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
    const leadershipReportsCollection = db.collection('leadership-reports');
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
        'assessment.learning_plan.title': title,
      },
      {
        $set: {
          'assessment.learning_plan.$.notes': [],
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
    const leadershipReportsCollection = db.collection('leadership-reports');
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
        'assessment.learning_plan.title': title,
      },
      {
        $set: {
          [`assessment.learning_plan.$.reactions.${reactionType}`]: reactionValue,
          [`assessment.learning_plan.$.reactions.${reactionType === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp'}`]: false,
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
    const interactionsCollection = db.collection('interactions');

    // Get the user's interaction document
    const interaction = await interactionsCollection.findOne({ user_id: userId });
    
    const points = interaction ? interaction.points : 0;

    return res.status(200).json({
      status: 'OK',
      points: points
    });

  } catch (error) {
    console.error('Get Points Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch points'
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

    // Get user's company ID from users collection
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

    // Check if user has already interacted with this title
    const existingInteraction = await interactionsCollection.findOne({
      user_id: userId
    });

    let result;
    if (existingInteraction) {
      // Check if LEARNING is already in the interacted_with array
      const hasLearningInteraction = existingInteraction.interacted_with.includes('LEARNING');
      
      // Update points and add LEARNING to interacted_with if not present
      result = await interactionsCollection.updateOne(
        { _id: existingInteraction._id },
        {
          $set: {
            points: existingInteraction.points + points,
            interaction_timestamp: new Date(),
          },
          ...(!hasLearningInteraction
            ? {
              $push: { interacted_with: 'LEARNING' },
            }
            : {}),
        },
      );
    } else {
      // Create new interaction
      result = await interactionsCollection.insertOne({
        user_id: userId,
        interaction_timestamp: new Date(),
        interacted_with: ['LEARNING'],
        learning_plan_title: title,
        points: points
      });
    }

    // After updating points, emit the new total to connected clients
    const updatedPoints = existingInteraction ? existingInteraction.points + points : points;
    
    // Emit points update event
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    // Comprehensive logging
    const logMetadata = {
      userId: userId,
      userEmail: user.email,
      companyId: user.companyId,
      learningPlanTitle: title,
      pointsAwarded: points,
      isFirstInteraction: !existingInteraction,
      currentInteractionTypes: existingInteraction 
        ? [...existingInteraction.interacted_with, ...(!existingInteraction.interacted_with.includes('LEARNING') ? ['LEARNING'] : [])]
        : ['LEARNING'],
      totalPoints: updatedPoints,
      timestamp: new Date().toISOString()
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Learning Plan Interaction recorded', logMetadata);

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
