const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
// JWT_SECRET is imported from middleware for consistency

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      middleName = '',
      lastName,
      fatherName,
      phoneNumber,
      email,
      password,
      dateOfBirth,
      cnic,
      userType,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !fatherName || !phoneNumber || !email || !password || !dateOfBirth || !cnic || !userType) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please provide all required profile fields, email, password, and user type'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({ 
        error: 'Password too short',
        message: 'Password must be at least 4 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      middleName,
      lastName,
      fatherName,
      phoneNumber,
      email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      cnic,
      userType,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        cnic: user.cnic,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to create account. Please try again.'
    });
  }
});

// Signin endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please provide email, password, and user type'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Check user type matches
    if (user.userType !== userType) {
      return res.status(401).json({ 
        error: 'Invalid user type',
        message: 'This account is registered as a ' + user.userType + ', not ' + userType
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        cnic: user.cnic,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to sign in. Please try again.'
    });
  }
});

module.exports = router;
