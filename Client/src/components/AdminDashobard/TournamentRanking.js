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

    const handleEdit = (user) => {
    setEditData(user);
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = (user) => {
    setIsEditModalOpen(false);
    setEditData(null);
    const rankingData = {
      userId: user.userId,
      eventId: eventId,
      newRank: Number(user.rank),
      score: user.score,
    };
    dispatch(assignEventRanking(rankingData));
    setLoadAfterSave(!loadAfterSave)
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
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
                      <button
                      className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    </td>
                  </tr>
                ))}
                {/* Modal for Edit User */}
                    {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6">
                      <div className="bg-[#232122] p-6 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-full overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4 text-white text-center">
                          Edit Player
                        </h2>
                        <form>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-white">
                              Rank
                            </label>
                            <input
                              type="number"
                              name="rank"
                              value={editData.rank}
                              onChange={handleChange}
                              className="w-full p-2 border-none rounded-md bg-[#393939] text-white"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-white">
                              Score
                            </label>
                            <input
                              type="number"
                              name="score"
                              value={editData.score}
                              onChange={handleChange}
                              className="w-full p-2 border-none rounded-md bg-[#393939] text-white"
                            />
                          </div>

                          <div className="flex justify-end space-x-4">
                            <button
                              type="button"
                              onClick={() => handleSave(editData)}
                              className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleCloseModal}
                              className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
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
