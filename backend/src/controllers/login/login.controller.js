// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db.js';
import { sendEmail } from '../../helper/email/sendEmail.js';
import { generateOtpEmailTemplate } from '../../helper/email/templates/otpEmailTemplate.js';

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
        status: user.status,
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

     res.cookie('authToken', token, {
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Accessible across all routes
    });

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

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
export const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Get user from database - need to convert userId to ObjectId
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database - need to use ObjectId here too
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } },
    );

    res.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

// @desc    Request password reset and send OTP
// @route   POST /api/onboarding/forgot-password
// @access  Public
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Check if user exists
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Store OTP and its expiry in database
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          resetPasswordOtp: otp,
          resetPasswordOtpExpiry: otpExpiry,
          resetPasswordVerified: false,
        },
      },
    );

    // Generate email template
    const emailTemplate = generateOtpEmailTemplate(user, otp);

    // Send email with OTP
    const emailResult = await sendEmail(
      { name: user.firstName, email: user.email },
      'Password Reset OTP - Thryve',
      emailTemplate
    );

    if (!emailResult.success) {
      // If email fails, remove the OTP from database
      await usersCollection.updateOne(
        { email },
        {
          $unset: {
            resetPasswordOtp: "",
            resetPasswordOtpExpiry: "",
            resetPasswordVerified: "",
          },
        }
      );
      
      return res.status(500).json({
        message: 'Failed to send OTP email. Please try again.',
      });
    }

    res.json({
      message: 'Password reset OTP sent successfully',
    });
  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// @desc    Verify OTP for password reset
// @route   POST /api/onboarding/verify-otp
// @access  Public
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Find user and check OTP
    const user = await usersCollection.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid or expired OTP',
      });
    }

    // Mark OTP as verified
    await usersCollection.updateOne({ email }, { $set: { resetPasswordVerified: true } });

    res.json({
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// @desc    Reset password after OTP verification
// @route   POST /api/onboarding/reset-password
// @access  Public
export const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Check if user exists and OTP was verified
    const user = await usersCollection.findOne({
      email,
      resetPasswordVerified: true,
      resetPasswordOtpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid or expired password reset verification',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    await usersCollection.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: {
          resetPasswordOtp: '',
          resetPasswordOtpExpiry: '',
          resetPasswordVerified: '',
        },
      },
    );

    res.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};
