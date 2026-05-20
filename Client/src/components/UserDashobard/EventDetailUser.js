import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventById, joinEvent, saveTeamData, getEventsByUserId, clearError } from "../../redux/features/eventsSlice";
import { getSubscriptionStatus } from "../../redux/features/paymentSlice";
import Loading from "../../utils/Loading/Loading";
import { useState } from "react";
import toast from 'react-hot-toast';

const EventDetailUser = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const { event, loading, error, message } = useSelector(
    (state) => state.events
  );
  const { subscriptionStatus } = useSelector((state) => state.payment);
  const [showPopup, setShowPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [teamType, setTeamType] = useState('solo');
  const [teamName, setTeamName] = useState('');
  const [leaderInfo, setLeaderInfo] = useState({
    xephraId: '',
    gamerId: '',
    gamerTag: '',
    phoneNumber: ''
  });
  const [teamMembers, setTeamMembers] = useState([
    { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
    { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
    { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' }
  ]);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Safely get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };
  
  const user = getUserData();
  const userId = user?.UserId;
  const userXephraId = userId; // Since userId is the XephraId in our system

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check subscription status when component mounts
  useEffect(() => {
      if (userId) {
        dispatch(getSubscriptionStatus(userId));
      }
    }, [dispatch, userId]);

  useEffect(() => {
    if (eventId) {
      // Clear any previous errors when component mounts
      dispatch(clearError());
      dispatch(getEventById(eventId));
    }
  }, [dispatch, eventId]);

  
  const handleJoin = async (_id) => {
    const eventId = _id;
    if (!userId) {
      toast.error("User is not logged in");
      return;
    }

    // Check if subscription is active
    if (!subscriptionStatus?.isActive) {
      setShowPopup(true);
      return;
    }

    // For team-based games, show team popup instead of direct join
    if (event?.gameMode && event.gameMode.toLowerCase() !== 'solo') {
      // Set default team type based on game mode
      const defaultTeamType = event.gameMode.toLowerCase();
      setTeamType(defaultTeamType);
      setShowTeamPopup(true);
      return;
    }

    // For solo games, proceed with direct join
    try {
      const joinResult = await dispatch(joinEvent({ userId, eventId }));
      
      if (joinEvent.fulfilled.match(joinResult)) {
        toast.success("Joined Successfully!");
        // Refresh user's registered events
        dispatch(getEventsByUserId(userId));
      } else {
        // Handle different error types
        if (joinResult.payload?.error === "ALREADY_REGISTERED") {
          toast.error(joinResult.payload.message || "You have already joined this event!");
        } else if (joinResult.payload?.error === "SUBSCRIPTION_REQUIRED") {
          toast.error(joinResult.payload.message || "You must have an active subscription to join events.");
        } else {
          toast.error(joinResult.payload?.message || "Failed to join event. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while joining the event. Please try again.");
    }
  };

  const handleTeamJoin = async () => {
    let teamData = {
      teamType: teamType,
      teamName: teamName,
      leaderInfo: {
        ...leaderInfo,
        xephraId: userXephraId
      },
      teamMembers: []
    };
    
    // Additional validation for team members BEFORE preparing team data
    if (teamType === 'duo' || teamType === 'squad') {
      const requiredMembers = teamType === 'duo' ? 1 : 3;
      let filledMembers = 0;
      
      for (let i = 0; i < requiredMembers; i++) {
        const member = teamMembers[i];
        if (member.xephraId.trim() && member.gamerId.trim() && member.gamerTag.trim()) {
          filledMembers++;
        } else if (member.xephraId.trim() || member.gamerId.trim() || member.gamerTag.trim()) {
          // Partial information provided
          setValidationError(`Please fill all fields for team member ${i + 2} or leave all fields empty.`);
          return;
        }
      }
      
      if (filledMembers === 0) {
        setValidationError(`Please add at least one team member for ${teamType} mode.`);
        return;
      }
    }
    
    // Now prepare team data - all members are validated above
    if (teamType === 'duo') {
      teamData.teamMembers = teamMembers.slice(0, 1).filter(member => 
        member.xephraId.trim() && member.gamerId.trim() && member.gamerTag.trim()
      );
    } else if (teamType === 'squad') {
      teamData.teamMembers = teamMembers.slice(0, 3).filter(member => 
        member.xephraId.trim() && member.gamerId.trim() && member.gamerTag.trim()
      );
    }

    // Validate leader information - all fields including phone number are required
    if (!leaderInfo.gamerId.trim() || !leaderInfo.gamerTag.trim() || !leaderInfo.phoneNumber.trim()) {
      setValidationError('Please fill all your information fields (Gamer ID, Gamer Tag, and Phone Number).');
      return;
    }

    // Validate all team members' subscriptions using Xephra IDs (including leader)
    setValidationLoading(true);
    
    try {
      // Always include team leader's Xephra ID for subscription validation
      let allXephraIds = [userXephraId]; // Start with team leader
      
      // Add team members' Xephra IDs if they exist
      if (teamData.teamMembers.length > 0) {
        const memberXephraIds = teamData.teamMembers
          .filter(member => member.xephraId.trim() !== '') // Only members with Xephra IDs
          .map(member => member.xephraId.trim());
        
        allXephraIds = [...allXephraIds, ...memberXephraIds];
      }
      
      if (allXephraIds.length > 0) {
        // Check all users' subscription status using Xephra IDs
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/payments/validate-team-subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            xephraIds: allXephraIds
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          setValidationError(result.message || 'Failed to validate subscriptions');
          setValidationLoading(false);
          return;
        }
        
        // Check if any users have inactive subscriptions
        if (result.inactiveMembers && result.inactiveMembers.length > 0) {
          const inactiveMembersList = result.inactiveMembers.join(', ');
          
          // Check if team leader is in inactive list
          const isLeaderInactive = result.inactiveMembers.includes(userXephraId);
          const inactiveTeamMembers = result.inactiveMembers.filter(id => id !== userXephraId);
          
          let errorMessage = "";
          
          // Team type specific error messages
          if (teamType === 'duo') {
            if (isLeaderInactive && inactiveTeamMembers.length > 0) {
              errorMessage = "Both you and your team member don't have active subscriptions. Please activate your subscriptions to join events.";
            } else if (isLeaderInactive) {
              errorMessage = "Your subscription is not active. Please activate your subscription to join events.";
            } else {
              errorMessage = "Your team member doesn't have an active subscription. They need to activate their subscription first.";
            }
          } else if (teamType === 'squad') {
            if (isLeaderInactive) {
              errorMessage = "Your subscription is not active. Please activate your subscription to join events.";
            } else if (inactiveTeamMembers.length === 1) {
              errorMessage = "One of your squad members doesn't have an active subscription. They need to activate their subscription first.";
            } else {
              errorMessage = `${inactiveTeamMembers.length} of your squad members don't have active subscriptions. They need to activate their subscriptions first.`;
            }
          } else {
            errorMessage = `The following team members don't have active subscriptions: ${inactiveMembersList}. They need to activate their subscriptions first.`;
          }
          
          setValidationError(errorMessage);
          setValidationLoading(false);
          return;
        }
      }
      
    } catch (error) {
      console.error('Subscription validation error:', error);
      setValidationError('Failed to validate subscriptions. Please try again.');
      setValidationLoading(false);
      return;
    }
    
    setValidationLoading(false);
    
    // If all validations pass, proceed with joining
    
    // First, join the event with just userId and eventId
    const joinResult = await dispatch(joinEvent({ 
      userId, 
      eventId
    }));
    
    // If join was successful, save the team data
    if (joinEvent.fulfilled.match(joinResult)) {
      const teamDataResult = await dispatch(saveTeamData({
        userId,
        eventId,
        teamData: teamData
      }));
      
      if (saveTeamData.fulfilled.match(teamDataResult)) {
        toast.success("Joined Successfully!");
        dispatch(getEventsByUserId(userId));
      } else {
        // Check if it's a subscription error
        if (teamDataResult.payload?.error === "SUBSCRIPTION_REQUIRED") {
          const errorMsg = teamDataResult.payload.message || "You must have an active subscription to join events.";
          setValidationError(errorMsg);
          toast.error(errorMsg);
        } else {
          toast.error(teamDataResult.payload?.message || "Failed to save team data. Please try again.");
        }
        setValidationLoading(false);
        return;
      }
    } else {
      // Check if it's a subscription error
      if (joinResult.payload?.error === "SUBSCRIPTION_REQUIRED") {
        const errorMsg = joinResult.payload.message || "You must have an active subscription to join events.";
        setValidationError(errorMsg);
        toast.error(errorMsg);
      } else if (joinResult.payload?.error === "ALREADY_REGISTERED") {
        toast.error(joinResult.payload.message || "You have already joined this event!");
      } else {
        toast.error(joinResult.payload?.message || "Failed to join event. Please try again.");
      }
      setValidationLoading(false);
      return; // Don't proceed if join failed
    }
    setShowTeamPopup(false);
    // Reset form to default based on game mode
    const defaultTeamType = event?.gameMode?.toLowerCase() || 'solo';
    setTeamType(defaultTeamType);
    setTeamName('');
    setLeaderInfo({
      xephraId: '',
      gamerId: '',
      gamerTag: '',
      phoneNumber: ''
    });
    setTeamMembers([
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' }
    ]);
    setValidationError('');
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newMembers = [...teamMembers];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };
    setTeamMembers(newMembers);
  };

  const handleLeaderInfoChange = (field, value) => {
    setLeaderInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeTeamPopup = () => {
    setShowTeamPopup(false);
    // Reset form to default based on game mode
    const defaultTeamType = event?.gameMode?.toLowerCase() || 'solo';
    setTeamType(defaultTeamType);
    setTeamName('');
    setLeaderInfo({
      xephraId: '',
      gamerId: '',
      gamerTag: '',
      phoneNumber: ''
    });
    setTeamMembers([
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' },
      { xephraId: '', gamerId: '', gamerTag: '', phoneNumber: '' }
    ]);
    setValidationError('');
  };

  if (!event) {
    return (
      <div className="text-center text-white bg-[#232122] py-16">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <Link to="/userdashboard" className="text-[#69363f] mt-4 block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }
  if (error) {
    console.log("error is", error);
  }

  return (
    <div className="min-h-screen bg-[#232122] text-[#b6a99a] py-16 px-4">
      <div className="max-w-4xl mx-auto bg-[#202938] rounded-lg overflow-hidden shadow-lg">
        <img
          className="w-full h-64 object-cover"
          src={`${process.env.REACT_APP_BACKEND}/${event?.image}`}
          alt={event?.title}
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#b8a896]">
            Tournament Title : {event?.title}
          </h1>
          <p className="text-[#69363f] font-bold mt-2">Game : {event?.game}</p>
          <p className="text-[#D4AD66] font-semibold mt-1">Game Mode: {event?.gameMode?.charAt(0).toUpperCase() + event?.gameMode?.slice(1)}</p>
          <p className="text-sm text-gray-400 mt-1">
            Date & Time : {event?.date} • {event?.time}
          </p>
          <p className="text-gray-300 mt-4">
            Description : {event?.description}
          </p>
          <p className="mt-6 text-lg text-white font-bold">
            Prize Pool: {event?.prizePool}
          </p>
          <div className="mt-6">
            <h2 className="text-xl text-[#b8a896] font-bold">Rules</h2>
            <p className="text-gray-300 mt-2">{event?.rules}</p>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <Link
              to="/userdashboard"
              className="bg-[#69363f] text-white px-6 py-3 rounded-md hover:bg-[#8f404f] transition"
            >
              Back to Events
            </Link>
             <button
              disabled={loading || subscriptionStatus?.loading}
              onClick={() => handleJoin(event?._id)}
              className="bg-[#8f404f] text-white px-6 py-3 rounded-md hover:bg-[#a34c5a] transition"
            >
              {loading ? "Joining..." : subscriptionStatus?.loading ? "Checking..." : "Join Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Popup */}
            {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#000000] border border-[#D19F43] rounded-lg p-6 max-w-md mx-4 relative">
                  <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-[#C9B796] hover:text-[#D19F43] text-xl font-bold"
                  >
                    ×
                  </button>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#D19F43] mb-4">
                      Subscription Required
                    </h3>
                    <p className="text-[#C9B796] mb-6">
                      You need to activate your subscription to join events.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={closePopup}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <Link to="/paymentportal">
                        <button
                          onClick={closePopup}
                          className="px-6 py-2 bg-gradient-to-r from-[#D19F43] via-[#d1a759] to-[#eb9a0d] text-black rounded-md hover:opacity-90 transition"
                        >
                          Activate Subscription
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

      {/* Team Selection Popup */}
      {showTeamPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#000000] border border-[#D19F43] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeTeamPopup}
              className="absolute top-2 right-2 text-[#C9B796] hover:text-[#D19F43] text-xl font-bold z-10"
            >
              ×
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#D19F43] mb-2">
                Select Team Type
              </h3>
              <p className="text-[#C9B796] mb-4 text-lg">
                Game: <span className="font-semibold text-[#D19F43]">{event?.game}</span>
              </p>
              
              {/* Radio Buttons */}
              <div className="mb-4 flex justify-center gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="solo"
                    name="teamType"
                    value="solo"
                    checked={teamType === 'solo'}
                    onChange={(e) => setTeamType(e.target.value)}
                    disabled={event?.gameMode?.toLowerCase() !== 'solo'}
                    className={`mr-2 ${event?.gameMode?.toLowerCase() !== 'solo' ? 'cursor-not-allowed opacity-50' : ''}`}
                  />
                  <label htmlFor="solo" className={`${event?.gameMode?.toLowerCase() !== 'solo' ? 'text-[#666] cursor-not-allowed' : 'text-[#C9B796]'}`}>Solo</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duo"
                    name="teamType"
                    value="duo"
                    checked={teamType === 'duo'}
                    onChange={(e) => setTeamType(e.target.value)}
                    disabled={event?.gameMode?.toLowerCase() !== 'duo'}
                    className={`mr-2 ${event?.gameMode?.toLowerCase() !== 'duo' ? 'cursor-not-allowed opacity-50' : ''}`}
                  />
                  <label htmlFor="duo" className={`${event?.gameMode?.toLowerCase() !== 'duo' ? 'text-[#666] cursor-not-allowed' : 'text-[#C9B796]'}`}>Duo</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="squad"
                    name="teamType"
                    value="squad"
                    checked={teamType === 'squad'}
                    onChange={(e) => setTeamType(e.target.value)}
                    disabled={event?.gameMode?.toLowerCase() !== 'squad'}
                    className={`mr-2 ${event?.gameMode?.toLowerCase() !== 'squad' ? 'cursor-not-allowed opacity-50' : ''}`}
                  />
                  <label htmlFor="squad" className={`${event?.gameMode?.toLowerCase() !== 'squad' ? 'text-[#666] cursor-not-allowed' : 'text-[#C9B796]'}`}>Squad</label>
                </div>
              </div>

              {/* Team Name Input - Show for Duo and Squad */}
              {(teamType === 'duo' || teamType === 'squad') && (
                <div className="mb-4">
                  <h4 className="text-[#C9B796] font-semibold mb-2 text-left">Team Name:</h4>
                  <input
                    type="text"
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#302A27] border border-[#C9B796] rounded-md text-[#C9B796] focus:outline-none focus:border-[#D19F43]"
                  />
                </div>
              )}

              {/* Team Member Inputs */}
              {teamType === 'solo' && (
                <div className="mb-4">
                  <h4 className="text-[#C9B796] font-semibold mb-3 text-left">Your Information:</h4>
                  
                  {/* Solo Player Info */}
                  <div className="p-4 bg-[#302A27] border border-[#C9B796] rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={`Your Xephra ID: ${userXephraId}`}
                        value={userXephraId}
                        disabled={true}
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#666] rounded-md text-[#888] cursor-not-allowed text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Gamer ID"
                        value={leaderInfo.gamerId}
                        onChange={(e) => handleLeaderInfoChange('gamerId', e.target.value)}
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#666] rounded-md text-[#C9B796] focus:outline-none focus:border-[#D19F43]"
                      />
                      <input
                        type="text"
                        placeholder="Gamer Tag"
                        value={leaderInfo.gamerTag}
                        onChange={(e) => handleLeaderInfoChange('gamerTag', e.target.value)}
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#666] rounded-md text-[#C9B796] focus:outline-none focus:border-[#D19F43]"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={leaderInfo.phoneNumber}
                        onChange={(e) => handleLeaderInfoChange('phoneNumber', e.target.value)}
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#666] rounded-md text-[#C9B796] focus:outline-none focus:border-[#D19F43]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {teamType === 'duo' && (
                <div className="mb-4">
                  <h4 className="text-[#C9B796] font-semibold mb-3 text-left">Team Member Details:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Team Leader Info - Current User */}
                    <div className="p-3 bg-[#302A27] border border-[#C9B796] rounded-md">
                      <p className="text-[#C9B796] text-sm mb-2 font-semibold">Team Leader (You)</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={`Xephra ID: ${userXephraId}`}
                          value={userXephraId}
                          disabled={true}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#888] cursor-not-allowed text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer ID"
                          value={leaderInfo.gamerId}
                          onChange={(e) => handleLeaderInfoChange('gamerId', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer Tag"
                          value={leaderInfo.gamerTag}
                          onChange={(e) => handleLeaderInfoChange('gamerTag', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={leaderInfo.phoneNumber}
                          onChange={(e) => handleLeaderInfoChange('phoneNumber', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                      </div>
                    </div>

                    {/* Team Member 2 */}
                    <div className="p-3 bg-[#302A27] border border-[#C9B796] rounded-md">
                      <p className="text-[#C9B796] text-sm mb-2 font-semibold">Team Member 2</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Xephra ID"
                          value={teamMembers[0]?.xephraId || ''}
                          onChange={(e) => handleTeamMemberChange(0, 'xephraId', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer ID"
                          value={teamMembers[0]?.gamerId || ''}
                          onChange={(e) => handleTeamMemberChange(0, 'gamerId', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer Tag"
                          value={teamMembers[0]?.gamerTag || ''}
                          onChange={(e) => handleTeamMemberChange(0, 'gamerTag', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {teamType === 'squad' && (
                <div className="mb-4">
                  <h4 className="text-[#C9B796] font-semibold mb-3 text-left">Squad Member Details:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Squad Leader Info - Current User */}
                    <div className="p-3 bg-[#302A27] border border-[#C9B796] rounded-md">
                      <p className="text-[#C9B796] text-sm mb-2 font-semibold">Squad Leader (You)</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={`Xephra ID: ${userXephraId}`}
                          value={userXephraId}
                          disabled={true}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#888] cursor-not-allowed text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer ID"
                          value={leaderInfo.gamerId}
                          onChange={(e) => handleLeaderInfoChange('gamerId', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Gamer Tag"
                          value={leaderInfo.gamerTag}
                          onChange={(e) => handleLeaderInfoChange('gamerTag', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={leaderInfo.phoneNumber}
                          onChange={(e) => handleLeaderInfoChange('phoneNumber', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                        />
                      </div>
                    </div>

                    {/* Squad Members 2, 3, 4 */}
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="p-3 bg-[#302A27] border border-[#C9B796] rounded-md">
                        <p className="text-[#C9B796] text-sm mb-2 font-semibold">Squad Member {index + 2}</p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Xephra ID"
                            value={teamMembers[index]?.xephraId || ''}
                            onChange={(e) => handleTeamMemberChange(index, 'xephraId', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Gamer ID"
                            value={teamMembers[index]?.gamerId || ''}
                            onChange={(e) => handleTeamMemberChange(index, 'gamerId', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Gamer Tag"
                            value={teamMembers[index]?.gamerTag || ''}
                            onChange={(e) => handleTeamMemberChange(index, 'gamerTag', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#666] rounded text-[#C9B796] focus:outline-none focus:border-[#D19F43] text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Error Message */}
              {validationError && (
                <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-md">
                  <p className="text-red-300 text-sm">{validationError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeTeamPopup}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTeamJoin}
                  disabled={validationLoading || loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#D19F43] via-[#d1a759] to-[#eb9a0d] text-black rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validationLoading ? "Validating Subscriptions..." : loading ? "Joining..." : "Join Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailUser;
