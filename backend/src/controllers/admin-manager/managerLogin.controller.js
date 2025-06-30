import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../config/db.js';

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
