import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { fetchUserStats } from "../../redux/features/rankingSlice";
import { getUser } from "../../redux/features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";
import Modal from "./Modal";

// Register the required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AllUserRankingBoard = ({ dark }) => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.ranking);
  const { profile } = useSelector((state) => state.profile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const userData = users?.result || null;

  const handleProfileView = (userId) => {
    dispatch(getUser(userId));
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  const doughnutData = (progress) => ({
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#854951", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  });

  const maxWightedScore = userData &&  Math.max(...userData.map((user) => user.weightedScore)
  );

  return (
    <div className="min-h-screen p-8 bg-[#875441] shadow-2xl shadow-gray-950  backdrop-blur-sm">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-[#D19F43] via-[#d1a759] to-[#eb9a0d] bg-clip-text text-transparent">
        Xephra Users Ranking Board
      </h1>

      <div className="grid">
        {/* Top Players Section */}
        <div className="bg-gradient-to-r from-[#D19F43] via-[#B2945C] via-[#C9B796] via-[#B39867] to-[#D4AD66] shadow-md rounded-lg p-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-center text-[#622D37]">
            All Players
          </h2>

          <div className="p-4 sm:p-6 space-y-6">
            {userData &&
              userData.map((item, ind) => {
                const progress = (item?.weightedScore / maxWightedScore) * 100;

                return (
                  <div
                    key={item._id}
                    className="bg-[#87544178] shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4"
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND}/${item?.userProfile?.profileImage}`}
                      alt={item?.userProfile?.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="text-center sm:text-left flex flex-col md:flex-row space-y-2">
                       <div >
                       <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                          {item?.userProfile?.fullName}
                        </h2>
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-full bg-[#69363F] h-2 rounded">
                            <div
                              className={`h-2 rounded ${
                                dark ? "bg-gradient-to-r from-[#AE8D52] via-[#BCA477] via-[#C6b492] via-[#B69A66] to-[#CBA766] " : "bg-gradient-to-r from-[#AE8D52] via-[#BCA477] via-[#C6b492] via-[#B69A66] to-[#CBA766] "
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-black">
                          Total Points: {item?.weightedScore}
                        </p>
                        <p className="text-sm sm:text-base text-black">
                          Rank: {ind + 1}
                        </p>
                        </div>
                        {/* <div className="w-16">
                        <Doughnut
                          data={doughnutData(progress)}
                          options={{
                            cutout: "80%",
                            plugins: {
                              tooltip: { enabled: false },
                            },
                          }}
                        />
                      </div> */}
                      </div>
                     
                      <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                        <button
                          onClick={() => handleProfileView(item?.userId)}
                          className="bg-[#854951] hover:bg-[#A15D66] text-white py-1 px-4 rounded mr-2"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} profile={profile} />
      </div>
    </div>
  );
};

export default AllUserRankingBoard;
