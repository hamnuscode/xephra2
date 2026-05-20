const express = require("express");
const UserSubmission = require("../models/UserSubmission");
const eventRankingBoard = require("../models/EventRankingBoard");
const UserEventStats = require("../models/userEventStats");
const Participant = require("../models/Participant");
const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const Events = require("../models/Events");
const { 
  notifyGameEntrySubmitted,
  notifyGameEntryApproved,
  notifyGameEntryRejected,
  notifyGameEntryDeleted
} = require("../utils/notificationHelpers");

exports.postRankingApproval = async (req, res) => {
  try {
    const { eventId, userId, rank, score, gameName } = req.body;
    const screenshot = req.file ? `uploads/${req.file.filename}` : null;
    if (!eventId || !userId) {
      return res.status(400).json({
        message: "EventId and userId are required!",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Screenshot is required",
      });
    }

    const newSubmission = new UserSubmission({
      eventId,
      userId,
      gameName,
      rank: rank || null,
      score: score || null,
      screenshot,
      createdAt: Date.now(),
    });

    const savedSubmission = await newSubmission.save();

    // Send notification to admin about new game entry submission
    try {
      const userData = await User.findOne({ userId });
      const eventData = await Events.findById(eventId);
      await notifyGameEntrySubmitted(savedSubmission, userData, eventData);
    } catch (notificationError) {
      console.error('Error sending game entry submitted notification:', notificationError);
      // Don't fail the main request if notification fails
    }

    res.status(200).json({
      message: "Submission created successfully",
      data: savedSubmission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required!" });
    }

    const submissions = await UserSubmission.find({ userId });

    res.status(200).json({
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.userApprovalDelete = async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const result = await UserSubmission.findOneAndDelete({ userId, eventId });
    if (!result) {
      return res.status(404).json({
        message: "no submission found for the given user",
      });
    }
    
    // Send notification to user about game entry deletion
    try {
      const eventData = await Events.findById(eventId);
      await notifyGameEntryDeleted(result._id, userId, eventData, "Your submission was removed by admin");
    } catch (notificationError) {
      console.error('Error sending game entry deleted notification:', notificationError);
      // Don't fail the main request if notification fails
    }
    
    res.status(200).json({
      message: "Submission deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.assignEventRanking = async (req, res) => {
  const { userId, eventId, newRank, score } = req.body;

  try {
    let event = await eventRankingBoard.findOne({ eventId });

    if (!event) {
      event = new eventRankingBoard({
        eventId,
        rankings: [],
      });
    }

    let points = calculatePoints(newRank);

    // Auto-increment ranks for existing users if the new rank conflicts
    const existingRank = event.rankings.find((r) => r.rank === newRank);
    if (existingRank) {
      event.rankings = event.rankings.map((r) =>
        r.rank >= newRank ? { ...r, rank: r.rank + 1 } : r
      );
    }

    // Check if the user already has a ranking
    const existingUserRank = event.rankings.find(
      (r) => r.userId.toString() === userId
    );
    let oldPoints = 0;

    if (existingUserRank) {
      // Calculate old points before updating rank
      oldPoints = calculatePoints(existingUserRank.rank);

      // Update rank and score for the existing user
      existingUserRank.rank = newRank;
      existingUserRank.score = score;
    } else {
      // Add a new ranking entry for the user
      event.rankings.push({ userId, rank: newRank, score });
    }

    // Sort the rankings based on the new ranks
    event.rankings.sort((a, b) => a.rank - b.rank);
    await event.save();

    // Fetch or create user stats
    let userStats = await UserEventStats.findOne({ userId });

    if (!userStats) {
      // Create new stats record if none exists
      userStats = new UserEventStats({
        userId,
        totalPoints: points,
        totalEvents: 1,
        averagePoints: points,
        weightedScore: points + 5 * 1,
      });
    } else {
      // Adjust user stats with new points and remove old points
      userStats.totalPoints = userStats.totalPoints - oldPoints + points;
      userStats.weightedScore =
        userStats.totalPoints + 5 * userStats.totalEvents;
      userStats.averagePoints = (
        userStats.totalPoints / userStats.totalEvents
      ).toFixed(2);
    }

    await userStats.save();

    let submission = await UserSubmission.findOne({ userId, eventId });
    submission.status = "approved";

    await submission.save();

    // Send notification to user about game entry approval
    try {
      const eventData = await Events.findById(eventId);
      await notifyGameEntryApproved(submission._id, userId, eventData);
    } catch (notificationError) {
      console.error('Error sending game entry approved notification:', notificationError);
      // Don't fail the main request if notification fails
    }

    res.status(200).json({
      message: "Rank Assigned and Stats Updated Successfully",
      data: event,
      userStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// Helper function to calculate points based on rank
function calculatePoints(rank) {
  switch (rank) {
    case 1:
      return 100;
    case 2:
      return 80;
    case 3:
      return 60;
    default:
      return 40;
  }
}

exports.declineRanking = async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const submission = await UserSubmission.findOne({ userId, eventId });
    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    submission.status = "not approved";
    await submission.save();
    
    // Send notification to user about game entry rejection
    try {
      const eventData = await Events.findById(eventId);
      await notifyGameEntryRejected(submission._id, userId, eventData, "Your submission did not meet the requirements");
    } catch (notificationError) {
      console.error('Error sending game entry rejected notification:', notificationError);
      // Don't fail the main request if notification fails
    }
    
    res.status(200).json({
      message: "not approved",
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.getRegisteredUsersAndRankings = async (req, res) => {
  const { eventId } = req.params;
  try {
    const participants = await Participant.find({ eventId });
    const userIds = participants.map((participant) => participant.userId);

    if (!participants.length) {
      return res.status(404).json({
        message: "No participants found for this event.",
      });
    }

    const userProfiles = await UserProfile.find({
      userId: { $in: userIds },
    });

    const EventRankingBoards = await eventRankingBoard.findOne({ eventId });

    const rankingsMap = {};
    if (EventRankingBoards) {
      EventRankingBoards.rankings.forEach((rank) => {
        rankingsMap[rank.userId] = {
          rank: rank.rank,
          score: rank.score,
        };
      });
    }

    const result = userProfiles.map((user) => ({
      userId: user.userId,
      name: user.fullName,
      image: user.profileImage,
      rank: rankingsMap[user.userId]?.rank || null,
      score: rankingsMap[user.userId]?.score || null,
    }));

    result.sort((a, b) => {
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      return a.rank - b.rank;
    });

    res.status(200).json({
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }

}


exports.getTopRanking= async (req, res) => {
  try {
    // Get top 5 users based on weightedScore in descending order
    const topUsersStats = await UserEventStats.find()
        .sort({ weightedScore: -1 })
        .limit(5);
    
    // Extract user IDs
    const userIds = topUsersStats.map(stats => stats.userId);
    
    // Fetch user profiles using userIds
    const userProfiles = await UserProfile.find({ userId: { $in: userIds } });
    
    // Create a mixed response combining stats and profiles
    const mixedData = topUsersStats.map(stats => {
        const userProfile = userProfiles.find(profile => profile.userId.toString() === stats.userId.toString());
        return { ...stats.toObject(), userProfile };
    });
    
    res.status(200).json({
      mixedData
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}
  


exports.getAllUsersRanking = async (req, res) => {
  try {
    const statsData = await UserEventStats.find({})
      .sort({ weightedScore: -1 })
      .lean();
    if (!statsData.length) {
      return res.status(404).json({
        message: "no users stats is found!",
      });
    }

    const userIds = statsData.map((stat) => stat.userId);
    const userProfles = await UserProfile.find({
      userId: { $in: userIds },
    }).lean();
    
    const result = statsData.map((stat) => {
      const profile = userProfles.find((p) => p.userId === stat.userId);
      return {
        ...stat,
        userProfile: profile || null,
      };
    });

    res.status(200).json({
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};


exports.getUserRank = async (req, res) => {
  try {
      const { userId } = req.query;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }

      // Fetch all users and their weighted scores
      const users = await UserEventStats.find({}, 'userId weightedScore');

      // Sort users by weightedScore in descending order
      users.sort((a, b) => b.weightedScore - a.weightedScore);

      // Assign ranks
      let ranks = {};
      let rank = 1;
      for (let i = 0; i < users.length; i++) {
          if (i > 0 && users[i].weightedScore < users[i - 1].weightedScore) {
              rank = i + 1;
          }
          ranks[users[i].userId] = rank;
      }

      // Return the rank of the requested user
      if (ranks[userId]) {
          return res.json({ userId, rank: ranks[userId] });
      } else {
          return res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
