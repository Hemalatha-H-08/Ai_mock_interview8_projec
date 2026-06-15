// ============================================
// db.config.js - MongoDB Connection
// ============================================
// Connects to MongoDB Atlas using Mongoose.
// Reference: mongoose.connect() - reference-mongodb.md
// ============================================

import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

let dbConnected = false;

export const isDatabaseConnected = () => dbConnected && mongoose.connection.readyState === 1;

const connectDB = async () => {
  try {
    // Get the connection string from environment variables
    const mongoURI = process.env.MONGODB_URI;

    // Safety check: make sure the URI exists
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in your .env file');
    }

    // Connect to MongoDB
    // Fail fast so the app can continue in demo mode if Atlas is unavailable.
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;

    console.error(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    dbConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Starting in local demo mode without MongoDB.');
    return false;
  }
};

export default connectDB;
