import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const changeGoalStatus = async (req, res) => {
    try {
        const db = getDb();
        const leadershipReportsCollection = db.collection('leadership-reports');
        const userId = req.user.id;
        const { title, saved } = req.body;

        if (!title || saved === undefined) {
            return res.status(400).json({
                status: 'Not OK',
                error: 'Title and saved status are required'
            });
        }

        // Find the latest report and update the specific learning plan
        const result = await leadershipReportsCollection.updateOne(
            {
                userId: userId,
                'assessment.learning_plan.title': title
            },
            {
                $set: {
                    'assessment.learning_plan.$.saved': saved,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'Not OK',
                error: 'Learning plan not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Learning plan saved status updated successfully'
        });

    } catch (error) {
        console.error('Save Learning Plan Error:', error);
        return res.status(500).json({
            status: 'Not OK',
            error: 'Failed to update learning plan saved status'
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
                error: 'Title and note are required'
            });
        }

        // Find the latest report and add the note to the specific learning plan
        const result = await leadershipReportsCollection.updateOne(
            {
                userId: userId,
                'assessment.learning_plan.title': title
            },
            {
                $push: {
                    'assessment.learning_plan.$.notes': note
                },
                $set: {
                    updatedAt: new Date()
                }
            },
            {
                upsert: true // This will create the notes array if it doesn't exist
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'Not OK',
                error: 'Learning plan not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Note added successfully'
        });

    } catch (error) {
        console.error('Add Note Error:', error);
        return res.status(500).json({
            status: 'Not OK',
            error: 'Failed to add note to learning plan'
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
                error: 'Title and updated note are required'
            });
        }

        // Update the note in the learning plan
        const result = await leadershipReportsCollection.updateOne(
            {
                userId: userId,
                'assessment.learning_plan.title': title
            },
            {
                $set: {
                    'assessment.learning_plan.$.notes': [updatedNote],
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'Not OK',
                error: 'Learning plan not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Note updated successfully'
        });

    } catch (error) {
        console.error('Edit Note Error:', error);
        return res.status(500).json({
            status: 'Not OK',
            error: 'Failed to update note'
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
                error: 'Title is required'
            });
        }

        // Remove all notes from the learning plan
        const result = await leadershipReportsCollection.updateOne(
            {
                userId: userId,
                'assessment.learning_plan.title': title
            },
            {
                $set: {
                    'assessment.learning_plan.$.notes': [],
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'Not OK',
                error: 'Learning plan not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Note deleted successfully'
        });

    } catch (error) {
        console.error('Delete Note Error:', error);
        return res.status(500).json({
            status: 'Not OK',
            error: 'Failed to delete note'
        });
    }
};
