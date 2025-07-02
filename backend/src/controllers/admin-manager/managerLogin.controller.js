import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const loginManagerController = async (req, res) => {
  try {
    const db = getDb();
    const adminUsersCollection = db.collection('admin-users');

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
