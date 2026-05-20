import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventById,
  fetchEventUsers,
} from "../../redux/features/eventsSlice";
import {
  fetchRegisteredUsersAndRankings,
  assignEventRanking,
} from "../../redux/features/rankingSlice";
import { getUser } from "../../redux/features/profileSlice";
import Modal from "../AdminDashobard/Modal";
import Loading from "../../utils/Loading/Loading";

const TournamentRankings = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { eventId } = useParams();
  const { event } = useSelector((state) => state.events);
  const { users, loading } = useSelector((state) => state.ranking);
  const [editData, setEditData] = useState(null);
  const [loadAfterSave, setLoadAfterSave] = useState(null);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchRegisteredUsersAndRankings(eventId));
    }
  }, [dispatch, eventId, loadAfterSave]);

  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (eventId) {
      dispatch(getEventById(eventId));
    }
  }, [dispatch, eventId]);

  if (loading) {
    return <Loading />;
  }

  const handleProfileView = (userId) => {
    dispatch(getUser(userId));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!event) {
    return (
      <div className="text-center text-white bg-[#232122] py-16">
        <h1 className="text-2xl md:text-3xl font-bold">Event Not Found</h1>
        <Link
          to="/dashboard"
          className="text-[#69363f] mt-4 block text-sm md:text-base"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#B7AB95] min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <div className="bg-[#854951] rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {event?.title}
          </h1>
          <p className="text-sm md:text-lg text-white mt-2">
            Compete for the prize pool of{" "}
            <span className="text-[#B6A99A] font-semibold">{event?.prizePool}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
        <div className="bg-[#232122] rounded-lg p-6 shadow-lg min-w-[640px]">
          {users.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#69363f] text-white">
                  <th className="px-4 py-3 text-center">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.userId}
                    className="border-b border-[#393939] hover:bg-[#2c2c2c] transition"
                  >
                    <td className="px-4 py-3 text-center font-bold text-[#b6a99a]">
                      {user.rank !== null ? `#${user.rank}` : "Unranked"}
                    </td>
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={
                          user?.image
                            ? `${process.env.REACT_APP_BACKEND}/${user?.image}`
                            : "https://via.placeholder.com/40"
                        }
                        alt={user?.fullName || "Unknown"}
                        className="w-10 h-10 rounded-full border-2 border-[#69363f]"
                      />
                      <span className="text-white text-sm md:text-base font-semibold">
                        {user?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#b6a99a]">{user?.score}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleProfileView(user?.userId)}
                        className="bg-[#854951] text-white px-4 py-2 text-xs md:text-sm rounded-md hover:bg-[#6a3c42] transition"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-300 text-lg py-4">
              No participants have joined this event yet.
            </p>
          )}
        </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} profile={profile} />
      </div>
    </div>
  );
};

export default TournamentRankings;
