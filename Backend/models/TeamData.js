const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  xephraId: {
    type: String,
    required: true
  },
  gamerId: {
    type: String,
    required: true
  },
  gamerTag: {
    type: String,
    required: true
  }
});

const leaderInfoSchema = new mongoose.Schema({
  xephraId: {
    type: String,
    required: true
  },
  gamerId: {
    type: String,
    required: false,
    default: ''
  },
  gamerTag: {
    type: String,
    required: false,
    default: ''
  },
  phoneNumber: {
    type: String,
    required: false,
    default: ''
  }
});

const teamDataSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  teamType: {
    type: String,
    enum: ['solo', 'duo', 'squad'],
    required: true
  },
  teamName: {
    type: String,
    required: function() {
      return this.teamType === 'duo' || this.teamType === 'squad';
    },
    default: function() {
      return this.teamType === 'solo' ? null : undefined;
    }
  },
  leaderInfo: {
    type: leaderInfoSchema,
    required: true
  },
  teamMembers: [{
    type: teamMemberSchema
  }]
}, {
  timestamps: true
});

// Ensure unique combination of eventId and userId
teamDataSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TeamData', teamDataSchema);
