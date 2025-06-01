import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';
import z from 'zod';

// Validation schema for goals
const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Value is required"),
  deadline: z.string().datetime("Invalid date format"),
  current_status: z.enum(["started", "deprecated", "completed"])
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
        error: 'User ID not found in token'
      });
    }

    // Find all goals for the user
    const userGoals = await goalsCollection.find({ userId }).toArray();

    return res.status(200).json({
      status: 'OK',
      data: userGoals
    });

  } catch (error) {
    console.error('Get Goals Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to fetch goals'
    });
  }
};

// Add new goal
export const addGoal = async (req, res) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection('goals');

    goalSchema.parse(req.body);

    // Create goal document
    const goalDocument = {
      userId: req.user.id,
      userEmail: req.user.email,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save goal to database
    const result = await goalsCollection.insertOne(goalDocument);

    return res.status(200).json({
      status: 'OK',
      data: {
        goalId: result.insertedId,
        ...goalDocument
      },
    });

  } catch (error) {
    console.error('Add Goal Error:', error);
    return res.status(400).json({
      status: 'Not OK',
      error: error.errors || 'Failed to add goal'
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
        error: 'Goal ID and new status are required'
      });
    }

    // Validate status
    if (!["started", "deprecated", "completed"].includes(current_status)) {
      return res.status(400).json({
        status: 'Not OK',
        error: 'Invalid status value'
      });
    }

    // Update goal status
    const result = await goalsCollection.updateOne(
      { _id: new ObjectId(goalId), userId: req.user.id },
      {
        $set: {
          current_status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Goal not found or unauthorized'
      });
    }

    return res.status(200).json({
      status: 'OK',
      goalId,
      current_status,
      message: 'Goal status updated successfully'
    });

  } catch (error) {
    console.error('Change Goal Status Error:', error);
    return res.status(500).json({
      status: 'Not OK',
      error: 'Failed to update goal status'
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
        error: 'Goal ID is required'
      });
    }

    const result = await goalsCollection.deleteOne({ _id: new ObjectId(goalId), userId: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 'Not OK',
        error: 'Goal not found or unauthorized'
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
      error: 'Failed to delete goal'
    });
  }
};
  