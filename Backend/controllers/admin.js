const express = require("express");
const moment = require("moment");
const Events = require("../models/Events");
const path = require("path");
const Profile = require("../models/AdminProfile");
const User = require("../models/User");
const Participant = require("../models/Participant");
const TeamData = require("../models/TeamData");
const { default: mongoose } = require("mongoose");
const UserSubmission = require("../models/UserSubmission");
const UserProfile = require("../models/UserProfile");
const ChatGroup = require('../models/ChatGroup');
const { 
  notifyEventCreated,
  notifyUserRegisteredEvent,
  notifyEventCompleted
} = require("../utils/notificationHelpers");

exports.newEvent = async (req, res) => {
  try {
    const { title, game, gameMode, date, time, description, prizePool, rules, adminId  } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    if (
      !title ||
      !game ||
      !gameMode ||
      !date ||
      !time ||
      !description ||
      !image ||
      !prizePool ||
      !rules
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }


    // Step 1: Create a Chat Group for the Event
    const chatGroup = new ChatGroup({
      name: `${title} Chat Group`,
      description: `This is the official chat group for the event: ${title}.`,
      users: [adminId] // Admin is added to the chat group automatically
    });

    const savedChatGroup = await chatGroup.save();


    // Step 2: Create the Event and link the chat group
    const newEvent = new Events({
      title,
      game,
      gameMode,
      date,
      time,
      description,
      image,
      prizePool,
      rules,
      chatGroupId: savedChatGroup._id // Link Chat Group ID to Event
    });

    await newEvent.save();
    
    // Send notification to all users about new event
    try {
      // Get all active users
      const activeUsers = await User.find({ isSuspended: false }, 'userId');
      const userIds = activeUsers.map(user => user.userId);
      
      if (userIds.length > 0) {
        await notifyEventCreated(newEvent, userIds);
      }
    } catch (notificationError) {
      console.error('Error sending event creation notifications:', notificationError);
      // Don't fail the main request if notification fails
    }
    
    res.status(201).json({
      message: "Event and chat group created successfully",
      event: newEvent,
      chatGroup: savedChatGroup
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postedEvents = async (req, res) => {
  try {
    const events = await Events.find({ hosted: false });
    res.status(200).json({ events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the event first to get chatGroupId before deletion
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }

    const deletedParticipants = await Participant.deleteMany({ eventId: id });
    // Delete associated ChatGroup
    if (event.chatGroupId) {
      await ChatGroup.findByIdAndDelete(event.chatGroupId);
    }

    const deletedEvent = await Events.findByIdAndDelete(id);

    if (!deletedEvent) {
      re.status(404).json({
        message: "Event not found!",
      });
    }

    res
      .status(200)
      .json({ message: "Event deleted successfully", event: deletedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST: Create a new admin profile
exports.createProfile = async (req, res) => {
  const {
    userId,
    username,
    fullName,
    bio,
    email,
    locationCity,
    locationCountry,
    phoneNumber,
    address,
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
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res
        .status(409)
        .json({ message: "Profile already exists for this user" });
    }

    // Fetch the user-related data you want to store in the profile schema
    const { role: role } = user;

    const newProfile = new Profile({
      username,
      fullName,
      bio,
      email,
      locationCity,
      locationCountry,
      phoneNumber,
      address,
      profileImage,
      userId,
      role,
    });

    await newProfile.save();
    res.status(201).json({
      message: "Profile created successfully",
      adminprofile: newProfile,
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
    const profile = await Profile.findOne({ userId });

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

// Example backend code for updating profile
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
  } = req.body;
  //  const profileImage = req.file ? req.file.path : null;
  const profileImage = req.file ? `uploads/${req.file.filename}` : null;
  try {
    // Find the profile by userId
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for this user" });
    }

    // Update the profile fields
    if (username) profile.username = username;
    if (fullName) profile.fullName = fullName;
    if (bio) profile.bio = bio;
    if (email) profile.email = email;
    if (locationCity) profile.locationCity = locationCity;
    if (locationCountry) profile.locationCountry = locationCountry;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (address) profile.address = address;
    if (profileImage) profile.profileImage = profileImage; // Update profile image if provided

    // Save the updated profile
    await profile.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", adminprofile: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, game, date, time, description, prizePool, rules } = req.body;

    const event = await Events.findById(id);
    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });
    }

    const updatedFields = {
      ...(title && { title }),
      ...(game && { game }),
      ...(date && { date }),
      ...(time && { time }),
      ...(description && { description }),
      ...(prizePool && { prizePool }),
      ...(rules && { rules }),
    };

    const updatedEvent = await Events.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({
        message: "Event Not Found!",
      });
    }

    res.status(200).json({
      message: "Event Found successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};

exports.getEventAndUsers = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const participantsData = await Participant.aggregate([
      {
        $match: { eventId: new mongoose.Types.ObjectId(eventId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "teamdatas",
          localField: "teamData",
          foreignField: "_id",
          as: "teamInfo",
        },
      },
      {
        $unwind: {
          path: "$teamInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "userId",
          foreignField: "userId",
          as: "profileDetails",
        },
      },
      {
        $unwind: {
          path: "$profileDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          registeredAt: 1,
          name: "$userDetails.name",
          email: "$userDetails.email",
          teamType: "$teamInfo.teamType",
          teamName: "$teamInfo.teamName",
          leaderInfo: "$teamInfo.leaderInfo",
          teamMembers: "$teamInfo.teamMembers",
          profilePicture: "$profileDetails.profilePicture",
          gamingProfile: "$profileDetails.gamingProfile",
        },
      },
      {
        $sort: { registeredAt: 1 }
      }
    ]);

    res.status(200).json({
      participantsData,
      totalParticipants: participantsData.length
    });
  } catch (error) {
    console.error("Error fetching event participants:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch event participants",
    });
  }
};

// Controller to mark an event as hosted
exports.markEventAsHosted = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Events.findByIdAndUpdate(
      eventId,
      { $set: { hosted: true } }, // Only update 'hosted' field
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Send completion notification to all participants
    try {
      const participants = await Participant.find({ eventId });
      const participantUserIds = participants.map(p => p.userId);
      
      if (participantUserIds.length > 0) {
        await notifyEventCompleted(event, participantUserIds);
      }
    } catch (notificationError) {
      console.error('Error sending event completion notifications:', notificationError);
      // Don't fail the main request if notification fails
    }

    res.status(200).json({ message: "Event hosted successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getEventSubmissions = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Fetch all submissions for the given event ID
    const submissions = await UserSubmission.find({ eventId });

    if (submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found for this event." });
    }

    // 2. Extract unique user IDs from submissions
    const userIds = [...new Set(submissions.map((sub) => sub.userId))];
    console.log("userIds:", userIds);

    // 3. Fetch user profiles using `userId` (string) from the User collection
    const users = await UserProfile.find({ userId: { $in: userIds } });

    res.json({
      eventId,
      totalSubmissions: submissions.length,
      submissions,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getTotalEventAndUsers = async (req, res) => {
  try {
    // Get the last 12 months from the current date
    const last12Months = [...Array(12)].map((_, i) =>
      moment().subtract(i, "months").format("MMMM") // "January", "February", etc.
    ).reverse(); // Reverse to get them in order from oldest to latest

    // Function to aggregate counts by month
    const aggregateByMonth = async (Model) => {
      return await Model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: moment().subtract(12, "months").toDate(), // Last 12 months
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month number (1-12)
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month number
        },
      ]);
    };

    // Fetch aggregated data
    const eventsData = await aggregateByMonth(Events);
    const usersData = await aggregateByMonth(User);

    // Convert MongoDB month numbers to full month names
    const monthMap = {};
    last12Months.forEach((month, index) => {
      monthMap[index + 1] = month;
    });

    // Map results into structured arrays
    const formatData = (data) => {
      return last12Months.map((month, i) => {
        const entry = data.find((item) => item._id === i + 1);
        return entry ? entry.count : 0;
      });
    };

    res.status(200).json({
      labels: last12Months,
      totalEvents: formatData(eventsData),
      totalUsers: formatData(usersData),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all participants for an event with team data
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid eventId format",
      });
    }

    // Get participants with populated team data and user profile
    const participants = await Participant.find({ eventId })
      .populate('teamData')
      .populate('eventId', 'title game gameMode')
      .sort({ registeredAt: -1 });

    if (!participants.length) {
      return res.status(404).json({
        message: "No participants found for this event",
      });
    }

    // Enhance data with user profiles
    const participantsWithProfiles = await Promise.all(
      participants.map(async (participant) => {
        const userProfile = await UserProfile.findOne({ 
          userId: participant.userId 
        }).select('username fullName profileImage email phoneNumber');

        return {
          participantId: participant._id,
          userId: participant.userId,
          registeredAt: participant.registeredAt,
          userProfile: userProfile || null,
          teamData: participant.teamData,
          event: participant.eventId
        };
      })
    );

    // Group by team type for better display
    const groupedByTeamType = participantsWithProfiles.reduce((acc, participant) => {
      if (participant.teamData) {
        const teamType = participant.teamData.teamType;
        if (!acc[teamType]) {
          acc[teamType] = [];
        }
        acc[teamType].push(participant);
      }
      return acc;
    }, {});

    // Summary statistics
    const summary = {
      totalParticipants: participants.length,
      soloTeams: groupedByTeamType.solo?.length || 0,
      duoTeams: groupedByTeamType.duo?.length || 0,
      squadTeams: groupedByTeamType.squad?.length || 0,
      totalPlayers: participants.reduce((total, p) => {
        if (p.teamData) {
          const teamSize = p.teamData.teamType === 'solo' ? 1 :
                          p.teamData.teamType === 'duo' ? 2 :
                          p.teamData.teamType === 'squad' ? 4 : 1;
          return total + teamSize;
        }
        return total + 1;
      }, 0)
    };

    res.status(200).json({
      message: "Participants retrieved successfully",
      summary,
      participants: participantsWithProfiles,
      groupedByTeamType
    });

  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({
      message: "Error retrieving participants",
      error: error.message
    });
  }
};

// Get detailed team information
exports.getTeamDetails = async (req, res) => {
  try {
    const { teamDataId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamDataId)) {
      return res.status(400).json({
        message: "Invalid teamDataId format",
      });
    }

    const teamData = await TeamData.findById(teamDataId);
    
    if (!teamData) {
      return res.status(404).json({
        message: "Team data not found",
      });
    }

    // Get leader profile
    const leaderProfile = await UserProfile.findOne({ 
      userId: teamData.leaderInfo.xephraId 
    }).select('username fullName profileImage email');

    // Get team members profiles
    const memberProfiles = await Promise.all(
      teamData.teamMembers.map(async (member) => {
        const profile = await UserProfile.findOne({ 
          userId: member.xephraId 
        }).select('username fullName profileImage email');
        return {
          ...member.toObject(),
          profile: profile || null
        };
      })
    );

    res.status(200).json({
      message: "Team details retrieved successfully",
      teamData: {
        ...teamData.toObject(),
        leaderProfile: leaderProfile || null,
        teamMembersWithProfiles: memberProfiles
      }
    });

  } catch (error) {
    console.error('Get team details error:', error);
    res.status(500).json({
      message: "Error retrieving team details",
      error: error.message
    });
  }
};



