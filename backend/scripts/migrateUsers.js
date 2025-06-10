const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

require('dotenv').config();

// Connect to database
connectDB();

const migrateUsers = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      if (!user.watchlist) {
        user.watchlist = [];
        await user.save();
        console.log(`Updated user: ${user.email}`);
      }
    }
    console.log('Migration completed successfully');
    process.exit();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

migrateUsers();