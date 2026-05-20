import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEventSubmissions,
  clearRankings,
  assignEventRanking,
  resetMessage,
  declineSubmission,
  deleteUserSubmission,
} from "../../redux/features/rankingSlice";
import { getEventById } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";
import { Link, useParams } from "react-router-dom";
import FullScreenModal from "../../features/FullScreenModal";
import toast from 'react-hot-toast';

const TournamentUsersRankingApproval = () => {
  const dispatch = useDispatch();
  const { rankings, loading, error, data, userStats, message, submissions } =
    useSelector((state) => state.ranking);
  const { event } = useSelector((state) => state.events);
  const { eventId } = useParams();
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(clearRankings()); // Clear old rankings
      dispatch(fetchEventSubmissions(eventId));
      dispatch(getEventById(eventId));
    }
  }, [dispatch, eventId, submissions, data]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetMessage());
    }
  }, [message, dispatch]);

  if (loading) {
    return <Loading />;
  }

  const handleEdit = (user) => {
    setEditData(user);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = (user) => {
    setIsModalOpen(false);
    setEditData(null);
    const rankingData = {
      userId: user.userId,
      eventId: user.eventId,
      newRank: Number(user.rank),
      score: user.score,
    };
    dispatch(assignEventRanking(rankingData));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleScreenShotCloseModal = () => {
    setIsScreenshotModalOpen(false);
  };

  const HandleApproveRanking = (submission) => {
    const rankingData = {
      userId: submission.userId,
      eventId: submission.eventId,
      newRank: submission.rank,
      score: submission.score,
    };
    dispatch(assignEventRanking(rankingData));
  };

  const handleDecline = (data) => {
    dispatch(declineSubmission({ userId: data.userId, eventId: data.eventId }));
  };
  const handleDelete = (data) => {
    dispatch(
      deleteUserSubmission({ userId: data.userId, eventId: data.eventId })
    );
  };

  return (
    <div className="bg-[url('https://wallpapercave.com/wp/wp2227274.jpg')] min-h-screen p-8 flex justify-center">
      <div className="container mx-auto bg-[#232122] p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between  items-center p-3 mb-3">
          <h1 className="text-3xl md:text-4xl font-bold  text-white text-center">
            {event?.title} Submissions
          </h1>
          <Link
            to={`/dashboard/tournamentrankings/${eventId}`}
            className="mt-4 inline-block bg-[#69363F] text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300 ease-in-out transform hover:bg-[#894b5c] hover:scale-105"
          >
            Users Ranking
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#2c2c2c] text-white rounded-lg overflow-hidden text-center">
            <thead>
              <tr className="bg-[#393939]">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">Player</th>
                <th className="py-3 px-6">Score</th>
                <th className="py-3 px-6">Screenshot</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rankings &&
              rankings.submissions &&
              rankings.submissions.length > 0 ? (
                rankings.submissions.map((submission) => {
                  const user = rankings.users.find(
                    (u) => u.userId === submission.userId
                  );
                  return (
                    <tr
                      key={submission._id}
                      className="border-b border-[#393939] hover:bg-[#3a3a3a] transition"
                    >
                      <td className="py-3 px-6">#{submission.rank}</td>
                      <td className="py-3 px-6 flex items-center justify-center space-x-4">
                        <img
                          src={
                            `${process.env.REACT_APP_BACKEND}/${user?.profileImage}` ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZckmT7vNz82FTBKW6y5ptouwWa3-OURdpaw&s"
                          }
                          alt={user?.fullName || "Unknown"}
                          className="w-12 h-12 rounded-full border-2 border-[#69363f]"
                        />
                        <span>{user?.fullName || "Unknown"}</span>
                      </td>
                      <td className="py-3 px-6">
                        {submission?.score || "N/A"}
                      </td>
                      <td
                        className="py-3 px-6 cursor-pointer"
                        onClick={() => setIsScreenshotModalOpen(true)}
                      >
                        <img
                          src={`${process.env.REACT_APP_BACKEND}/${submission?.screenshot}`}
                          alt="screenshot"
                          className="w-12 h-12 rounded mx-auto"
                        />
                      </td>
                      <FullScreenModal
                        image={`${process.env.REACT_APP_BACKEND}/${submission?.screenshot}`}
                        isOpen={isScreenshotModalOpen}
                        onClose={handleScreenShotCloseModal}
                      />
                      <td className="py-3 px-6 text-sm font-medium text-gray-300">
                        {submission.status || "Pending"}
                      </td>
                      <td className="py-3 px-6 space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => HandleApproveRanking(submission)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          onClick={() => handleEdit(submission)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                          onClick={() => handleDecline(submission)}
                        >
                          Decline
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(submission)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 px-6 text-white text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Edit User */}
      {isModalOpen && (
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
    </div>
  );
};

export default TournamentUsersRankingApproval;
