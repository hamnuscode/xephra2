// Helper functions to integrate notifications with existing controllers
const { NotificationService } = require('../controllers/notificationController');

// Function to get notification service instance
const getNotificationService = () => {
  if (global.io && global.io.notificationService) {
    return global.io.notificationService;
  }
  console.warn('Notification service not available. Make sure server is properly initialized.');
  return null;
};

// Helper functions for each notification type
const notifySubscriptionSubmitted = async (subscriptionData) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifySubscriptionSubmitted(subscriptionData);
    } catch (error) {
      console.error('Error sending subscription submitted notification:', error);
    }
  }
};

const notifySubscriptionApproved = async (subscriptionId, userId) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifySubscriptionApproved(subscriptionId, userId);
    } catch (error) {
      console.error('Error sending subscription approved notification:', error);
    }
  }
};

const notifySubscriptionRejected = async (subscriptionId, userId, reason) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifySubscriptionRejected(subscriptionId, userId, reason);
    } catch (error) {
      console.error('Error sending subscription rejected notification:', error);
    }
  }
};

const notifySubscriptionEdited = async (subscriptionId, userId, changes) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifySubscriptionEdited(subscriptionId, userId, changes);
    } catch (error) {
      console.error('Error sending subscription edited notification:', error);
    }
  }
};

const notifyEventCreated = async (eventData, userIds) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyEventCreated(eventData, userIds);
    } catch (error) {
      console.error('Error sending event created notification:', error);
    }
  }
};

const notifyUserRegisteredEvent = async (participantData, eventData, userData) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyUserRegisteredEvent(participantData, eventData, userData);
    } catch (error) {
      console.error('Error sending user registered event notification:', error);
    }
  }
};

const notifyEventCompleted = async (eventData, participantUserIds) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyEventCompleted(eventData, participantUserIds);
    } catch (error) {
      console.error('Error sending event completed notification:', error);
    }
  }
};

const notifyGameEntrySubmitted = async (submissionData, userData, eventData) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyGameEntrySubmitted(submissionData, userData, eventData);
    } catch (error) {
      console.error('Error sending game entry submitted notification:', error);
    }
  }
};

const notifyGameEntryApproved = async (submissionId, userId, eventData) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyGameEntryApproved(submissionId, userId, eventData);
    } catch (error) {
      console.error('Error sending game entry approved notification:', error);
    }
  }
};

const notifyGameEntryRejected = async (submissionId, userId, eventData, reason) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyGameEntryRejected(submissionId, userId, eventData, reason);
    } catch (error) {
      console.error('Error sending game entry rejected notification:', error);
    }
  }
};

const notifyGameEntryEdited = async (submissionId, userId, eventData, changes) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyGameEntryEdited(submissionId, userId, eventData, changes);
    } catch (error) {
      console.error('Error sending game entry edited notification:', error);
    }
  }
};

const notifyGameEntryDeleted = async (submissionId, userId, eventData, reason) => {
  const service = getNotificationService();
  if (service) {
    try {
      await service.notifyGameEntryDeleted(submissionId, userId, eventData, reason);
    } catch (error) {
      console.error('Error sending game entry deleted notification:', error);
    }
  }
};

module.exports = {
  getNotificationService,
  notifySubscriptionSubmitted,
  notifySubscriptionApproved,
  notifySubscriptionRejected,
  notifySubscriptionEdited,
  notifyEventCreated,
  notifyUserRegisteredEvent,
  notifyEventCompleted,
  notifyGameEntrySubmitted,
  notifyGameEntryApproved,
  notifyGameEntryRejected,
  notifyGameEntryEdited,
  notifyGameEntryDeleted
};
