const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../config/email');

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Forgot password - Send OTP
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email required',
        message: 'Please provide your email address',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        message: 'If an account exists with this email, you will receive an OTP.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt,
    });

    await otpDoc.save();

    // Send email
    const sent = await sendOTPEmail(email, otp);
    
    if (sent) {
      res.json({
        message: 'OTP sent to your email. Please check your inbox.',
      });
    } else {
      await OTP.findOneAndDelete({ email });
      res.status(500).json({
        error: 'Failed to send email',
        message: 'Could not send OTP. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to process request. Please try again.',
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Email and OTP are required',
      });
    }

    // Find OTP
    const otpDoc = await OTP.findOne({ email, otp });

    if (!otpDoc) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'Invalid or expired OTP. Please try again.',
      });
    }

    // Check expiration
    if (new Date() > otpDoc.expiresAt) {
      await OTP.findOneAndDelete({ email, otp });
      return res.status(400).json({
        error: 'OTP expired',
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Delete OTP after verification
    await OTP.findOneAndDelete({ email, otp });

    res.json({
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify OTP. Please try again.',
    });
  }
});

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Email, OTP, and new password are required',
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 4 characters',
      });
    }

    // Verify OTP again
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc || new Date() > otpDoc.expiresAt) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'Invalid or expired OTP.',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist.',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await OTP.findOneAndDelete({ email, otp });

    res.json({
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to reset password. Please try again.',
    });
  }
});

module.exports = router;

