import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getTopRanking } from "../../redux/features/rankingSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RankingBoard = () => {
  const dispatch = useDispatch();
  const { topranks, loading } = useSelector((state) => state.ranking);

  useEffect(() => {
    dispatch(getTopRanking());
  }, [dispatch]);

  if (loading) return <Loading />;

  const maxWeightedScore = Math.max(...topranks.map((u) => u.weightedScore), 1);

  const barChartData = {
    labels: topranks.map((u) => u?.userProfile?.fullName || "—"),
    datasets: [
      {
        label: "Score",
        data: topranks.map((u) => u.weightedScore),
        backgroundColor: "rgba(0,229,255,0.5)",
        borderColor: "#00E5FF",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10,14,39,0.95)",
        borderColor: "rgba(0,229,255,0.2)",
        borderWidth: 1,
        titleColor: "#00E5FF",
        bodyColor: "#9CA3AF",
      },
    },
    scales: {
      x: {
        ticks: { color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" },
        grid: { color: "rgba(75,85,99,0.15)" },
      },
      y: {
        ticks: { color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" },
        grid: { color: "rgba(75,85,99,0.15)" },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Ranking Board
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Players */}
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Top Players
            </h2>
            <Link
              to="/dashboard/allranking"
              className="text-sm font-medium"
              style={{ color: "#00E5FF", fontFamily: "Inter, sans-serif" }}
            >
              See All →
            </Link>
          </div>

          {topranks.length === 0 ? (
            <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No ranking data available.</p>
          ) : (
            <ul className="space-y-4">
              {topranks.map((user, index) => {
                const progress = (user.weightedScore / maxWeightedScore) * 100;
                return (
                  <li key={index} className="flex items-center gap-3">
                    <span
                      className="w-8 text-center font-bold text-sm flex-shrink-0"
                      style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                        >
                          {user?.userProfile?.fullName || "Unknown"}
                        </p>
                        <span
                          className="text-xs flex-shrink-0 ml-2"
                          style={{ color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          {user.weightedScore}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(75,85,99,0.3)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            background: "#00E5FF",
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Scores Chart */}
        <div
          className="rounded-xl p-6"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
        >
          <h2
            className="text-lg font-bold mb-5"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            Scores Overview
          </h2>
          <div style={{ height: 260 }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingBoard;
