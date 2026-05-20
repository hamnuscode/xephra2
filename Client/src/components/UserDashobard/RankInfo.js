import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const RankInfo = () => {
  const [showModal, setShowModal] = useState(false);

  const ranks = [
    { name: "Mythical", points: 3000 },
    { name: "Champion", points: 2000 },
    { name: "Diamond", points: 1500 },
    { name: "Platinum", points: 800 },
    { name: "Gold", points: 400 },
    { name: "Silver", points: 200 },
    { name: "Bronze", points: 0 },
  ];

  return (
    <div className="relative inline-block">
      {/* Info Icon */}
      <FaInfoCircle
        className="text-2xl text-[#8f404f] cursor-pointer hover:text-[#312612]"
        onClick={() => setShowModal(true)}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-72 sm:w-80">
            <h2 className="text-lg font-semibold text-center mb-4 text-white">Rank Tiers</h2>
            <ul className="space-y-2">
              {ranks.map((rank) => (
                <li key={rank.name} className="flex justify-between text-white">
                  <span className="font-semibold">{rank.name}</span>
                  <span>{rank.points} pts</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-[#8f404f] text-white py-2 rounded-lg hover:bg-gradient-to-r from-[#D19F43] via-[#d1a759] to-[#eb9a0d] text-[#C9B796]"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankInfo;
