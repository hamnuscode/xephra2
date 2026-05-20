// Test script to manually add notifications to database
// Run this in your backend directory: node testNotifications.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xephra')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Notification Schema (same as your model)
const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true },
  recipientType: { type: String, enum: ['user', 'admin'], required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  relatedData: {
    userId: String,
    eventId: String,
    paymentId: String,
    rankingId: String,
    extra: mongoose.Schema.Types.Mixed
  },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

async function createTestNotifications() {
  try {
    console.log('Creating test notifications...');

    // Test notifications for admin
    const testNotifications = [
      {
        recipientId: 'admin',
        recipientType: 'admin',
        type: 'subscription_submitted',
        title: 'New Subscription Submitted',
        message: 'A user has submitted a new subscription payment for review.',
        priority: 'high',
        relatedData: {
          userId: 'test_user_123',
          extra: {
            amount: '$29.99',
            plan: 'Premium'
          }
        }
      },
      {
        recipientId: 'admin',
        recipientType: 'admin', 
        type: 'user_registered_event',
        title: 'New Event Registration',
        message: 'User John Doe has registered for the PUBG Tournament.',
        priority: 'medium',
        relatedData: {
          eventId: 'event_456',
          userId: 'user_789',
          extra: {
            eventName: 'PUBG Tournament',
            userName: 'John Doe'
          }
        }
      },
      {
        recipientId: 'admin',
        recipientType: 'admin',
        type: 'game_entry_submitted', 
        title: 'Game Entry Submitted',
        message: 'New game entry submitted for tournament ranking approval.',
        priority: 'medium',
        relatedData: {
          eventId: 'event_456',
          userId: 'user_789',
          extra: {
            tournamentName: 'PUBG Championship',
            playerName: 'ProGamer123'
          }
        }
      },
      {
        recipientId: 'admin',
        recipientType: 'admin',
        type: 'test_notification',
        title: 'Test Notification',
        message: 'This is a test notification to verify the system is working.',
        priority: 'low'
      }
    ];

    // Delete existing test notifications
    await Notification.deleteMany({ type: 'test_notification' });
    console.log('Deleted existing test notifications');

    // Insert new test notifications
    const result = await Notification.insertMany(testNotifications);
    console.log(`Created ${result.length} test notifications`);

    // Show current notification count
    const totalCount = await Notification.countDocuments();
    const adminCount = await Notification.countDocuments({ recipientType: 'admin' });
    
    console.log(`Total notifications in database: ${totalCount}`);
    console.log(`Admin notifications: ${adminCount}`);
    
    console.log('\nRecent admin notifications:');
    const recent = await Notification.find({ recipientType: 'admin' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type createdAt isRead recipientId');
    
    recent.forEach(notif => {
      console.log(`- ${notif.title} (${notif.type}) - ${notif.isRead ? 'Read' : 'Unread'} - RecipientId: ${notif.recipientId}`);
    });

  } catch (error) {
    console.error('Error creating test notifications:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

createTestNotifications();
