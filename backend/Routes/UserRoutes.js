const express = require('express');
const router = express.Router();
const { 
  signUp, 
  signIn, 
  adminSignIn, 
  addToWatchlist, 
  removeFromWatchlist, 
  getWatchlist 
} = require('../controller/UserController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/signup', signUp); // User signup
router.post('/signin', signIn); // User signin
router.post('/admin/signin', adminSignIn); // Admin signin

// Protected routes (require authentication)
router.post('/watchlist/add', authMiddleware, addToWatchlist); // Add movie to watchlist
router.post('/watchlist/remove', authMiddleware, removeFromWatchlist); // Remove movie from watchlist
router.get('/watchlist', authMiddleware, getWatchlist); // Get user's watchlist

module.exports = router;