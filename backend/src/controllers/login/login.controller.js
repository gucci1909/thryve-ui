// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../config/db.js';

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        message: 'Account is suspended or inactive. Please contact support.',
      });
    }

    // Update last login timestamp
    await usersCollection.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY },
    );

    // Prepare user response object
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      phoneCountryCode: user.phoneCountryCode,
    };

    // Add personalized field to response only if it exists in user document
    if (user.personalized !== undefined) {
      userResponse.personalized = user.personalized;
    }

    // Return success response
    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
