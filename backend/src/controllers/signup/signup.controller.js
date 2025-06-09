import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../config/db.js';

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const signupController = async (req, res) => {
  const { email, phoneNumber, phoneCountryCode, password, firstName, inviteCode } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');
    const companiesCollection = db.collection('companies');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const newUser = {
      email,
      phoneNumber,
      phoneCountryCode,
      password: hashedPassword,
      firstName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    if (inviteCode) {
      const company = await companiesCollection.findOne({ INVITE_CODE: inviteCode });
      if (company) {
        newUser.companyId = inviteCode;
      }
    }

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: result.insertedId,
        email: newUser.email,
        firstName: newUser.firstName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY },
    );

    res.cookie('authToken', token, {
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Accessible across all routes
    });

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        email: newUser.email,
        firstName: newUser.firstName,
        phoneNumber: newUser.phoneNumber,
        phoneCountryCode: newUser.phoneCountryCode,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};
