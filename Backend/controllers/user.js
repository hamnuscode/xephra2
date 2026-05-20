const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const Events = require("../models/Events");
const { default: mongoose } = require("mongoose");
const Participant = require("../models/Participant");
const TeamData = require("../models/TeamData");
const ChatGroup = require("../models/ChatGroup");
const MessageModel = require("../models/Message");
const AdminChat = require("../models/AdminChatGroup");
const AdminMessageModel = require("../models/AdminMessage");
const AdminMessage = require("../models/AdminMessage");
const UserEventStats = require('../models/userEventStats');
const { notifyUserRegisteredEvent } = require("../utils/notificationHelpers");
// POST: Create a new user profile
exports.createProfile = async (req, res) => {
  const {
    userId,
    username,
    fullName,
    bio,
    email,
    phoneNumber,
    address,
    age,
    locationCity,
    locationCountry,
    favoriteGames,
  } = req.body;

  const profileImage = req.file ? `uploads/${req.file.filename}` : null;

  try {
    // Validate required fields
    if (!userId || !username || !email) {
      return res
        .status(400)
        .json({ message: "userId, username, and email are required" });
    }

    // Fetch user details by userId
    const user = await User.findOne({ userId }); // Using userId to find the user
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with the given userId" });
    }

    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return res
        .status(409)
        .json({ message: "Profile already exists for this user" });
    }

    // Fetch the user-related data you want to store in the profile schema
    const { role } = user;

    // Parse the favoriteGames if it's a string (sent from frontend as stringified JSON)
    let parsedFavoriteGames = favoriteGames;
    if (favoriteGames && typeof favoriteGames === "string") {
      parsedFavoriteGames = JSON.parse(favoriteGames); // Parse it back into an array
    }

    const newProfile = new UserProfile({
      username,
      fullName,
      bio,
      email,
      locationCity,
      locationCountry,
      phoneNumber,
      address,
      age,
      favoriteGames: parsedFavoriteGames, // Use parsed favoriteGames here
      profileImage,
      userId,
      role,
    });

    await newProfile.save();
    res.status(201).json({
      message: "Profile created successfully",
      userprofile: newProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating profile" });
  }
};

// Get profile details
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId exists
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the profile using the userId
    const profile = await UserProfile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return the profile data
    res.status(200).json(profile);
  } catch (error) {
    console.error(
      "Error fetching profile for userId:",
      userId,
      "Error:",
      error
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    username,
    fullName,
    bio,
    email,
    locationCity,
    locationCountry,
    phoneNumber,
    address,
    age,
    favoriteGames,
  } = req.body;
  // const profileImage = req.file ? req.file.path : null;
  const profileImage = req.file ? `uploads/${req.file.filename}` : null;

  try {
    // Find the profile by userId
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for this user" });
    }

    // Parse the favoriteGames if it's a string (sent from frontend as stringified JSON)
    if (favoriteGames && typeof favoriteGames === "string") {
      profile.favoriteGames = JSON.parse(favoriteGames); // Parse it back into an array
    } else {
      profile.favoriteGames = favoriteGames; // If already an array, just assign it
    }

    // Update other profile fields
    if (username) profile.username = username;
    if (fullName) profile.fullName = fullName;
    if (bio) profile.bio = bio;
    if (email) profile.email = email;
    if (locationCity) profile.locationCity = locationCity;
    if (locationCountry) profile.locationCountry = locationCountry;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (address) profile.address = address;
    if (age) profile.age = age;
    if (profileImage) profile.profileImage = profileImage; // Update profile image if provided

    // Save the updated profile
    await profile.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", userprofile: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

const getBadge = (score) => {

  if (score >= 3000) return "Mythical";
  if (score >= 2000) return "Champion";
  if (score >= 1500) return "Diamond";
  if (score >= 800) return "Platinum";
  if (score >= 400) return "Gold";
  if (score >= 200) return "Silver";
  return "Bronze";
};

exports.getuserBadge = async (req, res) => {
  try {
    const { userId } = req.params;

    const userStats = await UserEventStats.findOne({ userId });

    if (!userStats) {
        return res.status(404).json({ message: "User stats not found" });
    }

    // Determine badge based on weightedScore
    const badge = getBadge(userStats.weightedScore);

    res.status(200).json({ 
        userId: userStats.userId,
        weightedScore: userStats.weightedScore,
        badge: badge // Sending badge without storing it in DB
    });

} catch (error) {
  console.log(error)
    res.status(500).json({ message: "Server Error", error });
}
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password -resetPasswordExpires -resetPasswordToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndDelete({ userId: userId });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "User deleted Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();
    res.status(200).json({
      mesage: user.isSuspended
        ? "User suspended successfully"
        : "User unsuspended successfully",
      isSuspended: user.isSuspended,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        message: "User profile not found!",
      });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occured while retrieving the user profile",
      error,
    });
  }
};

exports.upcomingEvents = async (req, res) => {
  try {
    const events = await Events.find();
    res.status(200).json({ events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// exports.joinEvent = async (req, res) => {
//   try {
//     const { userId, eventId } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(eventId)) {
//       return res.status(400).json({
//         message: "Invalid eventId format",
//       });
//     }

//     const existingParticipant = await Participant.findOne({
//       userId,
//       eventId,
//     });

//     if (existingParticipant) {
//       return res.status(400).json({
//         message: "User already registered for this event!",
//       });
//     }

//     const participant = new Participant({ userId, eventId });
//     await participant.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       participant,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error,
//     });
//   }
// };

exports.joinEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    
    console.log('Join event request for userId:', userId);
    
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid eventId format",
      });
    }

    // MANDATORY: Check if user has active subscription before allowing to join
    const Payment = require("../models/Payment");
    const subscription = await Payment.findOne({
      'userDetails.userId': userId,
      'paymentStatus.status': 'verified',
      'paymentStatus.isActive': true
    }).sort({ 'paymentStatus.submissionDate': -1 });

    console.log('Subscription check for userId:', userId, 'Result:', !!subscription);

    if (!subscription) {
      return res.status(403).json({
        message: "You must have an active subscription to join events. Please activate your subscription first.",
        error: "SUBSCRIPTION_REQUIRED"
      });
    }

    const existingParticipant = await Participant.findOne({
      userId,
      eventId,
    });

    if (existingParticipant) {
      console.log('User already registered for event:', userId, eventId);
      return res.status(409).json({
        message: "You have already joined this event! You cannot join the same event multiple times.",
        error: "ALREADY_REGISTERED"
      });
    }

    // Create default/placeholder team data that will be updated later
    const defaultTeamData = new TeamData({
      eventId,
      userId,
      teamType: 'solo', // default type
      teamName: null,
      leaderInfo: {
        xephraId: userId,
        gamerId: '',
        gamerTag: '',
        phoneNumber: ''
      },
      teamMembers: []
    });

    console.log('Creating TeamData with:', defaultTeamData);
    const savedTeamData = await defaultTeamData.save();
    console.log('TeamData saved successfully:', savedTeamData._id);

    // Then create participant with team data reference
    const participant = new Participant({ 
      userId, 
      eventId,
      teamData: savedTeamData._id
    });
    console.log('Creating Participant with:', participant);
    await participant.save();
    console.log('Participant saved successfully:', participant._id);

    const event = await Events.findById(eventId);
    console.log(event);
    if (!event || !event.chatGroupId) {
      console.error(`Event not found or no chatGroupId for event: ${eventId}`);
      return res
        .status(500)
        .json({ message: "Chat group information not found!" });
    }
    const chatGroup = await ChatGroup.findById(event.chatGroupId);

    if (!chatGroup) {
      console.error(`Chat group not found with ID: ${event.chatGroupId}`);
      return res.status(500).json({ message: "Chat group not found!" });
    }

    // Convert IDs to strings for consistent comparison
    const userIdStr = userId.toString();
    const chatGroupUserIds = chatGroup.users.map((id) => id.toString());

    // Add user to chat group if not already a member
    if (!chatGroupUserIds.includes(userIdStr)) {
      chatGroup.users.push(userId);
      await chatGroup.save();
    }

    // Send notification to admin about user registration
    try {
      const userData = await User.findOne({ userId });
      await notifyUserRegisteredEvent(participant, event, userData);
    } catch (notificationError) {
      console.error('Error sending user registration notification:', notificationError);
      // Don't fail the main request if notification fails
    }

    res.status(201).json({
      message: "User registered successfully and added to chat group",
      participant
    });
  } catch (error) {
    console.error('Error in joinEvent:', error);
    res.status(500).json({
      message: "An error occurred while joining the event",
      error: error.message || error,
    });
  }
};

// Get team data for a participant
exports.getTeamData = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid eventId format",
      });
    }

    const participant = await Participant.findOne({ userId, eventId }).populate('teamData');
    
    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.status(200).json({
      message: "Team data retrieved successfully",
      teamData: participant.teamData
    });
  } catch (error) {
    console.error('Get team data error:', error);
    res.status(500).json({
      message: "Error retrieving team data",
      error: error.message
    });
  }
};

// Update team data
exports.updateTeamData = async (req, res) => {
  try {
    const { teamDataId } = req.params;
    const { teamData } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(teamDataId)) {
      return res.status(400).json({
        message: "Invalid teamDataId format",
      });
    }

    if (!teamData) {
      return res.status(400).json({
        message: "Team data is required",
      });
    }

    // Validate team structure based on type
    const { teamType, teamMembers } = teamData;
    
    if (teamType === 'solo' && teamMembers && teamMembers.length > 0) {
      return res.status(400).json({
        message: "Solo teams should not have additional members",
      });
    }
    if (teamType === 'duo' && (!teamMembers || teamMembers.length !== 1)) {
      return res.status(400).json({
        message: "Duo teams must have exactly 1 additional member",
      });
    }
    if (teamType === 'squad' && (!teamMembers || teamMembers.length !== 3)) {
      return res.status(400).json({
        message: "Squad teams must have exactly 3 additional members",
      });
    }

    const updatedTeamData = await TeamData.findByIdAndUpdate(
      teamDataId,
      teamData,
      { new: true, runValidators: true }
    );

    if (!updatedTeamData) {
      return res.status(404).json({
        message: "Team data not found",
      });
    }

    res.status(200).json({
      message: "Team data updated successfully",
      teamData: updatedTeamData
    });
  } catch (error) {
    console.error('Update team data error:', error);
    res.status(500).json({
      message: "Error updating team data",
      error: error.message
    });
  }
};

// Save team data for a participant (separate from joining event)
exports.saveTeamData = async (req, res) => {
  try {
    const { eventId, teamData } = req.body;
    const userId = req.body.userId || req.user?.userId; // Get userId from request body or auth
    
    console.log('Save team data request for userId:', userId);
    console.log('Team data:', teamData);
    
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid eventId format",
      });
    }

    if (!teamData || !teamData.teamType || !teamData.leaderInfo) {
      return res.status(400).json({
        message: "Team data is required with teamType and leaderInfo",
      });
    }

    // MANDATORY: Validate subscription for ALL users (leader + team members)
    const Payment = require("../models/Payment");
    const User = require("../models/User");
    
    // Collect all user IDs that need subscription validation
    let allUserIds = [userId]; // Start with team leader
    
    // Add team members' user IDs if they exist
    if (teamData.teamMembers && teamData.teamMembers.length > 0) {
      const memberUserIds = teamData.teamMembers
        .filter(member => member.xephraId && member.xephraId.trim() !== '')
        .map(member => member.xephraId.trim());
      
      allUserIds = [...allUserIds, ...memberUserIds];
    }
    
    console.log('Validating subscriptions for user IDs:', allUserIds);
    
    // Check subscription for each user
    const subscriptionChecks = await Promise.all(
      allUserIds.map(async (checkUserId) => {
        const subscription = await Payment.findOne({
          'userDetails.userId': checkUserId,
          'paymentStatus.status': 'verified',
          'paymentStatus.isActive': true
        }).sort({ 'paymentStatus.submissionDate': -1 });
        
        console.log(`Subscription check for userId ${checkUserId}:`, !!subscription);
        
        return {
          userId: checkUserId,
          hasActiveSubscription: !!subscription
        };
      })
    );
    
    // Find users without active subscriptions
    const inactiveUsers = subscriptionChecks
      .filter(check => !check.hasActiveSubscription)
      .map(check => check.userId);
    
    if (inactiveUsers.length > 0) {
      console.log('Users with inactive subscriptions:', inactiveUsers);
      
      // Create team type specific error messages
      let errorMessage = "";
      let details = "";
      
      // Check if team leader is in inactive list
      const isLeaderInactive = inactiveUsers.includes(userId);
      const inactiveMembers = inactiveUsers.filter(id => id !== userId);
      
      if (teamData.teamType === 'duo') {
        if (isLeaderInactive && inactiveMembers.length > 0) {
          errorMessage = "Both you and your team member don't have active subscriptions.";
          details = `Team leader (${userId}) and team member (${inactiveMembers[0]}) need to activate their subscriptions.`;
        } else if (isLeaderInactive) {
          errorMessage = "Your subscription is not active.";
          details = `Team leader (${userId}) needs to activate subscription to join events.`;
        } else {
          errorMessage = "Your team member doesn't have an active subscription.";
          details = `Team member (${inactiveMembers[0]}) needs to activate subscription.`;
        }
      } else if (teamData.teamType === 'squad') {
        if (isLeaderInactive) {
          if (inactiveMembers.length > 0) {
            errorMessage = `You and ${inactiveMembers.length} team member${inactiveMembers.length > 1 ? 's' : ''} don't have active subscriptions.`;
            details = `Team leader (${userId}) and members (${inactiveMembers.join(', ')}) need to activate their subscriptions.`;
          } else {
            errorMessage = "Your subscription is not active.";
            details = `Team leader (${userId}) needs to activate subscription to join events.`;
          }
        } else {
          errorMessage = `${inactiveMembers.length} team member${inactiveMembers.length > 1 ? 's' : ''} ${inactiveMembers.length > 1 ? "don't" : "doesn't"} have active subscriptions.`;
          details = `Following team members need to activate their subscriptions: ${inactiveMembers.join(', ')}`;
        }
      } else { // solo
        errorMessage = "Your subscription is not active.";
        details = `User ${userId} needs to activate subscription to join events.`;
      }
      
      return res.status(403).json({
        message: errorMessage,
        error: "SUBSCRIPTION_REQUIRED",
        teamType: teamData.teamType,
        inactiveUsers: inactiveUsers,
        isLeaderInactive: isLeaderInactive,
        inactiveMembers: inactiveMembers,
        details: details
      });
    }
    
    console.log('All users have active subscriptions, proceeding with team data save');

    // Find the participant first to get their teamDataId
    const participant = await Participant.findOne({ userId, eventId });
    
    if (!participant) {
      return res.status(404).json({
        message: "Participant not found. Please join the event first.",
      });
    }

    if (!participant.teamData) {
      return res.status(400).json({
        message: "No team data record found for this participant.",
      });
    }

    // Validate team structure based on type
    const { teamType, teamMembers } = teamData;
    
    if (teamType === 'solo' && teamMembers && teamMembers.length > 0) {
      return res.status(400).json({
        message: "Solo teams should not have additional members",
      });
    }
    if (teamType === 'duo' && (!teamMembers || teamMembers.length !== 1)) {
      return res.status(400).json({
        message: "Duo teams must have exactly 1 additional member",
      });
    }
    if (teamType === 'squad' && (!teamMembers || teamMembers.length !== 3)) {
      return res.status(400).json({
        message: "Squad teams must have exactly 3 additional members",
      });
    }

    // Update the existing team data
    const updatedTeamData = await TeamData.findByIdAndUpdate(
      participant.teamData,
      {
        teamType: teamData.teamType,
        teamName: teamData.teamName,
        leaderInfo: teamData.leaderInfo,
        teamMembers: teamData.teamMembers || []
      },
      { new: true, runValidators: true }
    );

    if (!updatedTeamData) {
      return res.status(404).json({
        message: "Team data not found",
      });
    }

    res.status(200).json({
      message: "Team data saved successfully",
      teamData: updatedTeamData
    });
  } catch (error) {
    console.error('Save team data error:', error);
    res.status(500).json({
      message: "Error saving team data",
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatGroupId } = req.params;

    // Fetch messages
    const messages = await MessageModel.find({
      chatGroupId: new mongoose.Types.ObjectId(chatGroupId),
    })
      .sort({ createdAt: 1 }) // Oldest messages first for proper chronological display
      .limit(100); // Limit to prevent overwhelming the client

    // Get usernames for all messages in a more efficient way
    const messagesWithUsernames = await Promise.all(
      messages.map(async (message) => {
        // Convert the message to a plain object so we can add properties
        const messageObj = message.toObject ? message.toObject() : {...message};
        
        try {
          const userProfile = await User.findOne({ userId: message.senderId });
          
          // Add username to the message object
          messageObj.username = userProfile ? userProfile.name : "Unknown User";
        
        } catch (err) {
          console.error(`Error fetching user profile for senderId ${message.senderId}:`, err);
          messageObj.username = "Unknown User";
        }
        
        return messageObj;
      })
    );

    res.status(200).json({ messages: messagesWithUsernames });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Add endpoint to fetch older messages (for pagination)
exports.getOlderMessages = async (req, res) => {
  try {
    const { chatGroupId } = req.params;
    const { before } = req.query; // timestamp or message ID to get messages before

    let query = { chatGroupId: new mongoose.Types.ObjectId(chatGroupId) };

    // If 'before' parameter is provided, add it to the query
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 }) // Latest first
      .limit(20) // Fetch 20 messages per request
      .sort({ createdAt: 1 }); // Then sort back to oldest first for client display

    const hasMore = messages.length === 20;

    res.status(200).json({ messages, hasMore });
  } catch (error) {
    console.error("Error fetching older messages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getAdminUserChatGroups = async (req, res) => {
  try {
    const { userId } = req.query;  

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find chat group where the admin has the given userId
    const privateChat = await AdminChat.findOne({ userId: userId }); // ✅ Await the query

    if (!privateChat) {
      return res.status(404).json({ message: "Chat group not found" });
    }

    return res
      .status(200)
      .json({ privateChat, message: "Chat groups fetched successfully" });
  } catch (error) {
    console.error("Error fetching user chat groups:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch chat groups", error: error.message });
  }
};

exports.getUserChatGroups = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Find all participants entries for this user
    const participants = await Participant.find({ userId });

    if (!participants.length) {
      return res.status(200).json({
        chatGroups: [],
        message: "User is not participating in any events",
      });
    }

    // Get all event IDs the user is participating in
    const eventIds = participants.map((participant) => participant.eventId);

    // Find all events with these IDs to get their chat group IDs
    const events = await Events.find({ _id: { $in: eventIds } });

    const chatGroupIds = events
      .filter((event) => event.chatGroupId)
      .map((event) => event.chatGroupId);

    // Find all chat groups
    const chatGroups = await ChatGroup.find({ _id: { $in: chatGroupIds } });

    return res.status(200).json({
      chatGroups,
      message: "Chat groups fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user chat groups:", error);
    return res.status(500).json({
      message: "Failed to fetch chat groups",
      error: error.message,
    });
  }
};
exports.getEvents = async (req, res) => {
  try {
    const { userId } = req.body;
    const events = await Participant.find({ userId }).populate("eventId");
    res.status(200).json({
      events,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get only hosted events
exports.getHostedEvents = async (req, res) => {
  try {
    const hostedEvents = await Events.find({ hosted: true });
    res.status(200).json(hostedEvents);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getProfileExisting = async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await UserProfile.findOne({ userId });

    if (userProfile) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getSingleMessages = async (req, res) => {
  try {
    const { chatGroupId } = req.params;
    if (!chatGroupId) {
      return res.status(400).json({ message: "ChatGroupId is required" });
    }

    const ObjectId = new mongoose.Types.ObjectId(chatGroupId);
    const messages = await AdminMessage.find({ chatGroupId: ObjectId }).sort(
      { createdAt: 1 }
    );

    // Add usernames to messages
    const messagesWithUsernames = await Promise.all(
      messages.map(async (message) => {
        // Convert the message to a plain object so we can add properties
        const messageObj = message.toObject ? message.toObject() : {...message};
        
        try {
          const userProfile = await User.findOne({ userId: message.senderId });
          
          // Add username to the message object
          messageObj.username = userProfile ? userProfile.name : "Unknown User";
          
          return messageObj;
        } catch (error) {
          console.log(`Error fetching user for message: ${error.message}`);
          messageObj.username = "Unknown User";
          return messageObj;
        }
      })
    );

    res.status(200).json({ messages: messagesWithUsernames });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};


exports.getAdminUserSingleChats = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Find all chat groups where adminId matches
    const chatGroups = await AdminChat.find({ adminId });

    // Fetch user profiles for each chat group
    const chatGroupsWithUsers = await Promise.all(
      chatGroups.map(async (group) => {
        const userProfile = await UserProfile.findOne({ userId: group.userId }).select("profileImage username").lean();

        return {
          ...group._doc,  // Spread existing group data
          userProfile: userProfile || null,  // Attach user profile (null if not found)
        };
      })
    );

    res.status(200).json({ chatGroups: chatGroupsWithUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupsForAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Find chat groups where adminId exists inside the users array
    const chatGroups = await ChatGroup.find({ users: adminId });

    res.status(200).json({ chatGroups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.postuploadedfileinchat = async(req, res) =>{
  console.log("Uploaded File:", req.file); // Debugging line
  if(!req.file){
    return res.status(400).json({error: "no file uploaded"})
  }
  res.status(200).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    mimetype: req.file.mimetype,
  })
}
