import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';
import z from 'zod';
import logger from '../../utils/logger.js';

// Validation schema for goals
const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.string().min(1, 'Value is required'),
  deadline: z.string().datetime('Invalid date format'),
  current_status: z.enum(['not-started', 'started', 'deprecated', 'completed']),
});

// Add reflection schema
const reflectionSchema = z.object({
  content: z.string().min(1, 'Reflection content is required'),
  date: z.string().datetime('Invalid date format').optional(),
});

// Get all goals for a user
export const getGoals = async (req, res) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection('goals');

    // Get user ID from authenticated token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'User ID not found in token',
      });
    }

    // Find all goals for the user
    const userGoals = await goalsCollection.find({ userId }).toArray();

    return res.status(200).json({
      status: 'OK',
      data: userGoals,
    });
  } catch (error) {
    console.error('Get Goals Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch goals',
    });
  }
};

// Add new goal
export const addGoal = async (req, res) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection('goals');

    // Create goal document with default status as not-started
    const goalDocument = {
      userId: req.user.id,
      userEmail: req.user.email,
      ...req.body,
      current_status: 'not-started', // Set default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save goal to database
    const result = await goalsCollection.insertOne(goalDocument);

    return res.status(200).json({
      status: 'OK',
      data: {
        goalId: result.insertedId,
        ...goalDocument,
      },
    });
  } catch (error) {
    console.error('Add Goal Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to add goal',
    });
  }
};

// Change goal status
export const changeGoalStatus = async (req, res) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection('goals');

    const { goalId, current_status } = req.body;

    if (!goalId || !current_status) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Goal ID and new status are required',
      });
    }

    // Validate status
    if (!['not-started', 'started', 'deprecated', 'completed'].includes(current_status)) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Invalid status value',
      });
    }

    // Update goal status
    const result = await goalsCollection.updateOne(
      { _id: new ObjectId(goalId), userId: req.user.id },
      {
        $set: {
          current_status,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Goal not found or unauthorized',
      });
    }

    return res.status(200).json({
      status: 'OK',
      goalId,
      current_status,
      message: 'Goal status updated successfully',
    });
  } catch (error) {
    console.error('Change Goal Status Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to update goal status',
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection('goals');

    const { goalId } = req.body;

    if (!goalId) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Goal ID is required',
      });
    }

    const result = await goalsCollection.deleteOne({
      _id: new ObjectId(goalId),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Goal not found or unauthorized',
      });
    }
    return res.status(200).json({
      status: 'OK',
      goalId,
    });
  } catch (error) {
    console.error('Delete Goal Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to delete goal',
    });
  }
};

// Add new reflection
export const addReflection = async (req, res) => {
  try {
    const db = getDb();
    const reflectionsCollection = db.collection('reflections');

    reflectionSchema.parse(req.body);

    // Create reflection document
    const reflectionDocument = {
      userId: req.user.id,
      userEmail: req.user.email,
      content: req.body.content,
      date: req.body.date || new Date().toISOString(),
      createdAt: new Date(),
    };

    // Save reflection to database
    const result = await reflectionsCollection.insertOne(reflectionDocument);

    // start points to the user
    // Get user's company ID from users collection
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user || !user.companyId) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'User or company ID not found',
      });
    }

    const companiesCollection = db.collection('companies');
    const company = await companiesCollection.findOne({ INVITE_CODE: user?.companyId });
    const points = company?.ReflectionInteractionPoint || 0;

    const interactionsCollection = db.collection('interactions');

    // Record the new interaction as a separate event
    const interactionDoc = {
      user_id: req.user.id,
      interaction_type: 'REFLECTION',
      content: req.body.content,
      points: points,
      interaction_timestamp: new Date(),
    };

    const result_1 = await interactionsCollection.insertOne(interactionDoc);

    // Emit total points (aggregate for user)
    const totalPoints = await interactionsCollection
      .aggregate([
        { $match: { user_id: req.user.id } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ])
      .toArray();

    const updatedPoints = totalPoints[0]?.total || 0;

    // ✅ Update total points in users collection
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { totalPoints: updatedPoints } },
    );

    // Emit points update event
    const clients = req.app.locals.clients || new Map();
    const userClients = clients.get(req.user.id);
    if (userClients) {
      userClients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify({ points: updatedPoints })}\n\n`);
      });
    }

    // Add comprehensive logging
    const logMetadata = {
      userId: req.user.id,
      userEmail: user.email,
      companyId: user.companyId,
      content: req.body.content,
      interactionType: 'REFLECTION',
      pointsAwarded: points,
      totalPoints: updatedPoints,
      timestamp: new Date().toISOString(),
    };

    req.logger = logger.withRequestContext(req);
    req.logger.info('Reflection Interaction recorded', logMetadata);

    // end points

    return res.status(200).json({
      status: 'OK',
      data: {
        reflectionId: result.insertedId,
        ...reflectionDocument,
      },
    });
  } catch (error) {
    console.error('Add Reflection Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to add reflection',
    });
  }
};

// Get all reflections for a user
export const getReflections = async (req, res) => {
  try {
    const db = getDb();
    const reflectionsCollection = db.collection('reflections');

    // Get user ID from authenticated token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'User ID not found in token',
      });
    }

    // Find all reflections for the user, sorted by date descending
    const userReflections = await reflectionsCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();

    return res.status(200).json({
      status: 'OK',
      data: userReflections,
    });
  } catch (error) {
    console.error('Get Reflections Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch reflections',
    });
  }
};
