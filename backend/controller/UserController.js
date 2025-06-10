const User = require('../models/User');
const Movie = require('../models/Movie');
const Admin = require('../models/Admin'); // Add Admin model import
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User signup
exports.signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ fullName, email, password });
    await user.save();
    console.log('User registered successfully:', { fullName, email });
    res.status(201).json({ message: 'User registered successfully', user: { fullName, email } });
  } catch (error) {
    console.error('Error in signUp:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in signUp', error: error.message });
  }
};

// User signin
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('User signed in successfully:', { email, token });
    res.status(200).json({ message: 'Login successful', token, user: { fullName: user.fullName, email: user.email } });
  } catch (error) {
    console.error('Error in signIn:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in signIn', error: error.message });
  }
};

// Admin signin
exports.adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Use Admin model to find the admin
    const admin = await Admin.findOne({ email: 'admin@example.com' }); // Match the seeded email
    if (!admin) {
      return res.status(401).json({ message: 'Admin user not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Admin signed in successfully:', { email: admin.email, token });
    res.status(200).json({ message: 'Admin login successful', token, user: { email: admin.email } });
  } catch (error) {
    console.error('Error in adminSignIn:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in adminSignIn', error: error.message });
  }
};

// Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    console.log('addToWatchlist called with req.user:', req.user);
    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
    }

    const userId = req.user.id;
    const { movieId } = req.body;

    console.log('User ID:', userId, 'Movie ID:', movieId);

    if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
      console.log('Invalid movie ID:', movieId);
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      console.log('Movie not found for ID:', movieId);
      return res.status(404).json({ message: 'Movie not found' });
    }

    let user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.watchlist.includes(movieId)) {
      console.log('Movie already in watchlist for user:', userId);
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(movieId);
    await user.save();
    console.log('Watchlist updated for user:', userId);

    user = await User.findById(userId).populate('watchlist');
    res.status(200).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error in addToWatchlist:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in addToWatchlist', error: error.message });
  }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    console.log('removeFromWatchlist called with req.user:', req.user);
    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
    }

    const userId = req.user.id;
    const { movieId } = req.body;

    console.log('User ID:', userId, 'Movie ID:', movieId);

    if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
      console.log('Invalid movie ID:', movieId);
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    let user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.watchlist.includes(movieId)) {
      console.log('Movie not in watchlist for user:', userId);
      return res.status(400).json({ message: 'Movie not in watchlist' });
    }

    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();
    console.log('Watchlist updated for user:', userId);

    user = await User.findById(userId).populate('watchlist');
    res.status(200).json({ message: 'Movie removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error in removeFromWatchlist:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in removeFromWatchlist', error: error.message });
  }
};

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    console.log('getWatchlist called with req.user:', req.user);
    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).populate('watchlist');
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Watchlist retrieved for user:', userId);
    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error('Error in getWatchlist:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in getWatchlist', error: error.message });
  }
};