import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventById,
  fetchEventUsers,
  markEventAsHosted,
} from "../../redux/features/eventsSlice";
import { getUser } from "../../redux/features/profileSlice";
import Loading from "../../utils/Loading/Loading";
import { FiArrowLeft } from "react-icons/fi";
import Modal from "./Modal";

const EventDetailAdmin = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEventHosted, setIsEventHosted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { eventId } = useParams();
  const { event, loading, error, participants, hostEvent } = useSelector(
    (state) => state.events
  );
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (eventId) {
      dispatch(getEventById(eventId));
      dispatch(fetchEventUsers(eventId));
    }
  }, [dispatch, eventId]);

  const handleProfileView = (userId) => {
    dispatch(getUser(userId));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleHostEventClick = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmHostEvent = () => {
    dispatch(markEventAsHosted(eventId));
    setIsEventHosted(true);
    setIsConfirmModalOpen(false);
  };

  // Calculate team statistics
  const getTeamStats = () => {
    if (!participants || participants.length === 0) return null;
    
    const stats = participants.reduce((acc, participant) => {
      const teamType = participant.teamType || 'unknown';
      acc[teamType] = (acc[teamType] || 0) + 1;
      return acc;
    }, {});
    
    return stats;
  };

  // Calculate total individual participants (team leaders + team members)
  const getTotalIndividuals = () => {
    if (!participants || participants.length === 0) return 0;
    
    return participants.reduce((total, participant) => {
      // Count team leader (1) + team members
      const teamLeader = 1;
      const teamMembers = participant.teamMembers ? participant.teamMembers.length : 0;
      return total + teamLeader + teamMembers;
    }, 0);
  };

  const teamStats = getTeamStats();
  const totalIndividuals = getTotalIndividuals();

  // Filter participants based on comprehensive search
  const filteredParticipants = participants.filter(participant => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in basic participant info
    const basicMatch = 
      participant.name?.toLowerCase().includes(searchLower) ||
      participant.userId?.toLowerCase().includes(searchLower) ||
      participant.email?.toLowerCase().includes(searchLower);
    
    // Search in leader info
    const leaderMatch = 
      participant.leaderInfo?.xephraId?.toLowerCase().includes(searchLower) ||
      participant.leaderInfo?.gamerId?.toLowerCase().includes(searchLower) ||
      participant.leaderInfo?.gamerTag?.toLowerCase().includes(searchLower) ||
      participant.leaderInfo?.phoneNumber?.toLowerCase().includes(searchLower);
    
    // Search in team info
    const teamMatch = 
      participant.teamType?.toLowerCase().includes(searchLower) ||
      participant.teamName?.toLowerCase().includes(searchLower);
    
    // Search in team members
    const memberMatch = participant.teamMembers?.some(member => 
      member.xephraId?.toLowerCase().includes(searchLower) ||
      member.gamerId?.toLowerCase().includes(searchLower) ||
      member.gamerTag?.toLowerCase().includes(searchLower)
    );
    
    return basicMatch || leaderMatch || teamMatch || memberMatch;
  });

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export participants data as CSV
  const exportParticipantsCSV = () => {
    if (participants.length === 0) return;

    const headers = [
      'S.No',
      'Name',
      'Email',
      'User ID',
      'Registration Date',
      'Team Type',
      'Team Name',
      'Leader Gamer ID',
      'Leader Gamer Tag',
      'Leader Phone',
      'Team Members Count'
    ];

    const csvData = participants.map((participant, index) => [
      index + 1,
      participant.name || '',
      participant.email || '',
      participant.userId || '',
      formatDate(participant.registeredAt),
      participant.teamType || '',
      participant.teamName || '',
      participant.leaderInfo?.gamerId || '',
      participant.leaderInfo?.gamerTag || '',
      participant.leaderInfo?.phoneNumber || '',
      participant.teamMembers?.length || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.title}_participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log("error is", error);
  }

  if (!event) {
    return (
      <div className="text-center text-white bg-[#232122] py-16">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <Link to="/dashboard" className="text-[#69363f] mt-4 block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e2a36] to-[#2a3d54] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Button */}
        <div className="text-left mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-[#f1b500] transition-all duration-300 ease-in-out"
          >
            <FiArrowLeft className="mr-2 text-2xl" /> Back to Events
          </Link>
        </div>

        {/* Event Details */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-4xl font-bold text-[#f1b500]">
              Tournament: {event?.title}
            </h2>
            <p className="text-xl text-[#f0f0f0]">Game : {event?.game}</p>
            <p className="text-lg text-[#D4AD66] font-semibold">Game Mode: {event?.gameMode?.charAt(0).toUpperCase() + event?.gameMode?.slice(1)}</p>
            <p className="text-lg text-[#f0f0f0] mt-4">
              Description : {event?.description}
            </p>
            <p className="text-2xl text-[#f1b500] font-semibold mt-6">
              Prize Pool: {event?.prizePool}
            </p>
            <p className="text-lg text-[#f0f0f0] mt-2">
              Date & Time: {event?.date} • {event?.time}
            </p>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-[#f1b500]">Rules</h3>
              <p className="text-lg text-[#e0e0e0] mt-2">{event?.rules}</p>
            </div>
          </div>
          <div className="lg:w-1/3">
            <img
              className="w-full h-[300px] object-cover rounded-lg shadow-lg"
              src={`${process.env.REACT_APP_BACKEND}/${event?.image}`}
              alt={event?.title}
            />
          </div>
        </div>

        {/* Host Event Button or Message */}

        <div className="text-center mt-8">
          {event?.hosted || isEventHosted ? (
            <p className="text-2xl text-[#f1b500] font-bold">
              This event has been hosted
            </p>
          ) : (
            <>
              <button
                onClick={handleHostEventClick}
                className="bg-[#f1b500] text-[#232122] font-bold py-2 px-6 rounded-lg transition-all duration-300"
              >
                Host Event
              </button>
              <p className="text-[#f0f0f0] mt-2">
                Click to mark this event as hosted.
              </p>
            </>
          )}
        </div>

        {/* Participants */}
        <div>
          <h2 className="text-4xl font-bold text-[#f1b500] mb-6">
            Participants
          </h2>
          
          {/* Team Statistics */}
          {teamStats && (
            <div className="bg-[#2a3d54] p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#f1b500] mb-4">
                Registration Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#f1b500]">{totalIndividuals}</p>
                  <p className="text-[#a1a1a1]">Total Participants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#f1b500]">{participants.length}</p>
                  <p className="text-[#a1a1a1]">Total Teams</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#f1b500]">{participants.length}</p>
                  <p className="text-[#a1a1a1]">Team Leaders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#f1b500] capitalize">{event?.gameMode}</p>
                  <p className="text-[#a1a1a1]">Event Type</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-[#36474f] p-8 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-[#a1a1a1] font-semibold">
                Total Participants: {participants.length}
                {filteredParticipants.length !== participants.length && 
                  ` (Showing ${filteredParticipants.length})`
                }
              </p>
              
              {/* Search Controls */}
              {participants.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search by name, ID, email, gamer tag, phone, team name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 rounded bg-[#2a3d54] text-white border border-[#4a5568] focus:border-[#f1b500] focus:outline-none min-w-[300px]"
                  />
                </div>
              )}
            </div>
            {filteredParticipants.length === 0 ? (
              <div className="text-center text-[#a1a1a1] py-8">
                <p className="text-lg">
                  {participants.length === 0 
                    ? "No participants registered yet." 
                    : "No participants match your search criteria."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-[#f1b500] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredParticipants.map((participant, index) => {
                  const originalIndex = participants.findIndex(p => p.userId === participant.userId);
                  return (
                    <div
                      key={participant.userId || index}
                      className="bg-[#2a3d54] p-6 rounded-lg border border-[#4a5568]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-[#f1b500] rounded-full flex items-center justify-center text-[#232122] font-bold text-lg">
                            {originalIndex + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-[#f1b500]">
                              {participant.name}
                            </h3>
                            <p className="text-[#a1a1a1] text-sm">
                              Registered: {formatDate(participant.registeredAt)}
                            </p>
                            {participant.email && (
                              <p className="text-[#a1a1a1] text-sm">
                                Email: {participant.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link
                          onClick={() => handleProfileView(participant?.userId)}
                          className="bg-[#f1b500] text-[#232122] py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#d19f43] font-semibold"
                        >
                          View Profile
                        </Link>
                      </div>
                    
                    {/* Team Information */}
                    {participant.teamType && (
                      <div className="border-t border-[#4a5568] pt-4">
                        <h4 className="text-lg font-semibold text-[#f1b500] mb-3">
                          Team Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[#e0e0e0]">
                              <span className="text-[#a1a1a1]">Team Type:</span> 
                              <span className="ml-2 capitalize font-semibold text-[#f1b500]">
                                {participant.teamType}
                              </span>
                            </p>
                            {participant.teamName && (
                              <p className="text-[#e0e0e0] mt-2">
                                <span className="text-[#a1a1a1]">Team Name:</span> 
                                <span className="ml-2 font-semibold text-[#f1b500]">
                                  {participant.teamName}
                                </span>
                              </p>
                            )}
                          </div>
                          
                          {/* Leader Information */}
                          {participant.leaderInfo && (
                            <div>
                              <h5 className="text-md font-semibold text-[#d19f43] mb-2">
                                Team Leader
                              </h5>
                              <div className="space-y-1">
                                {participant.leaderInfo.xephraId && (
                                  <p className="text-[#e0e0e0] text-sm">
                                    <span className="text-[#a1a1a1]">Xephra ID:</span> 
                                    <span className="ml-2 font-semibold">{participant.leaderInfo.xephraId}</span>
                                  </p>
                                )}
                                {participant.leaderInfo.gamerId && (
                                  <p className="text-[#e0e0e0] text-sm">
                                    <span className="text-[#a1a1a1]">Gamer ID:</span> 
                                    <span className="ml-2">{participant.leaderInfo.gamerId}</span>
                                  </p>
                                )}
                                {participant.leaderInfo.gamerTag && (
                                  <p className="text-[#e0e0e0] text-sm">
                                    <span className="text-[#a1a1a1]">Gamer Tag:</span> 
                                    <span className="ml-2">{participant.leaderInfo.gamerTag}</span>
                                  </p>
                                )}
                                {participant.leaderInfo.phoneNumber && (
                                  <p className="text-[#e0e0e0] text-sm">
                                    <span className="text-[#a1a1a1]">Phone:</span> 
                                    <span className="ml-2">{participant.leaderInfo.phoneNumber}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Team Members */}
                        {participant.teamMembers && participant.teamMembers.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-md font-semibold text-[#d19f43] mb-2">
                              Team Members
                            </h5>
                            <div className="space-y-2">
                              {participant.teamMembers.map((member, memberIndex) => (
                                <div key={memberIndex} className="bg-[#1e2a36] p-3 rounded">
                                  <div className="flex justify-between items-start">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm flex-grow">
                                      <p className="text-[#e0e0e0]">
                                        <span className="text-[#a1a1a1]">Xephra ID:</span> 
                                        <span className="ml-1 font-semibold">{member.xephraId}</span>
                                      </p>
                                      <p className="text-[#e0e0e0]">
                                        <span className="text-[#a1a1a1]">Gamer ID:</span> 
                                        <span className="ml-1">{member.gamerId}</span>
                                      </p>
                                      <p className="text-[#e0e0e0]">
                                        <span className="text-[#a1a1a1]">Tag:</span> 
                                        <span className="ml-1">{member.gamerTag}</span>
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleProfileView(member.xephraId)}
                                      className="bg-[#d19f43] text-[#232122] text-xs py-1 px-3 rounded transition-all duration-300 hover:bg-[#f1b500] font-semibold ml-3"
                                    >
                                      View Profile
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} profile={profile} />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-[#2a3d54] text-white p-8 rounded-xl shadow-2xl text-center w-[90%] max-w-md transform scale-95 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-[#f1b500]">
              Confirm Action
            </h2>
            <p className="text-lg text-[#e0e0e0] mt-4">
              Are you sure you want to host this event?
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={confirmHostEvent}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
              >
                Yes, Host Event
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailAdmin;
