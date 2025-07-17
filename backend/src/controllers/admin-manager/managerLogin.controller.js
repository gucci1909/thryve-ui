import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const loginManagerController = async (req, res) => {
  try {
    const db = getDb();
    const adminUsersCollection = db.collection('admin-users');
    const companyCollection = db.collection('companies');

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await adminUsersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    if (user.role !== 'company-admin' && user.role !== 'super-admin') {
      return res.status(401).json({
        message: 'Account is not having admin-access. Please contact support.',
      });
    }

    if (user.role !== 'super-admin') {
      const company = await companyCollection.findOne({ _id: new ObjectId(user?.companyId) });

      if (company.status != 'active') {
        return res.status(401).json({
          message: 'Company is suspended or inactive. Please contact support.',
        });
      }
    }

    await adminUsersCollection.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY },
    );

    const adminUserResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      companyId: user.companyId,
    };

    res.json({
      message: 'Login successful',
      user: adminUserResponse,
      token,
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
    return;
  }
};

export const changeStatusManagerController = async (req, res) => {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    const { status } = req.body;
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Validate status input
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Status must be a boolean value' });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedStatus = status ? 'active' : 'inactive';

    const updateResult = await usersCollection.updateOne(
      { _id: user._id },
      { $set: { status: updatedStatus } },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update user status' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        status: updatedStatus,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const findByEmailController = async (req, res) => {
  try {
    const db = getDb();
    const adminUsersCollection = db.collection('users');

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await adminUsersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.json({
      message: 'User found successful',
      user: user,
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
    return;
  }
};

export const findAllChatsController = async (req, res) => {
  try {
    const db = getDb();
    const chatsCollection = db.collection('chats');
    const rolePlayChatsCollection = db.collection('role-play-chats');

    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User_id required' });
    }

    // Fetch all chats and role-play chats
    const [chats, rolePlayChats] = await Promise.all([
      chatsCollection.find({ user_id }).toArray(),
      rolePlayChatsCollection.find({ user_id }).toArray(),
    ]);

    // Helper to extract the projected data
    function projectChatData(chatDoc) {
      const session_id = chatDoc.session_id;
      const created_at = chatDoc.created_at;
      const chat_context = chatDoc.chat_context || [];

      // Find the first user message
      const firstUserMessage = chat_context.find((c) => c.from === 'user');

      return {
        session_id,
        chatType: firstUserMessage?.chatType || 'unknown',
        created_at,
        first_question: firstUserMessage?.chat_text || '',
      };
    }

    // Combine and project both chat types
    const combinedChats = [...chats.map(projectChatData), ...rolePlayChats.map(projectChatData)];

    // Optional: sort by latest first
    combinedChats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.status(200).json({
      status: 'OK',
      chats: combinedChats,
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
    return;
  }
};

export const findChatByIDController = async (req, res) => {
  try {
    const db = getDb();
    const chatCollection = db.collection('chats');
    const rolePlayChatCollection = db.collection('role-play-chats');

    const { user_id, session_id } = req.body;

    if (!user_id || !session_id) {
      return res.status(400).json({ error: 'user_id and session_id required' });
    }

    // Look in both collections
    const [chat, rolePlayChat] = await Promise.all([
      chatCollection.findOne({ session_id, user_id }),
      rolePlayChatCollection.findOne({ session_id, user_id }),
    ]);

    const result = chat || rolePlayChat;

    if (!result) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'No chat found for the given session_id.',
      });
    }

    return res.status(200).json({
      status: 'OK',
      session_id: result.session_id,
      chatType: result.chat_context?.[0]?.chatType || 'unknown',
      chat_context: result.chat_context || [],
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
    return;
  }
};
