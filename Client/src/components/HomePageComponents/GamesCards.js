import React from "react";
import { Link } from "react-router-dom";

export default function GamesCards() {
  const games = [
    {
      title: "PUBG: Battlegrounds",
      description:
        "A battle royale game where players fight to be the last one standing.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/493057-285x380.jpg",
    },
    {
      title: "Fortnite",
      description:
        "A popular battle royale with building mechanics and vibrant visuals.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg",
    },
    {
      title: "Call of Duty: Warzone",
      description:
        "An action-packed battle royale from the Call of Duty franchise.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/512710-285x380.jpg",
    },
    {
      title: "Minecraft",
      description:
        "A sandbox game about breaking and placing blocks in a pixelated world.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/27471-285x380.jpg",
    },
    {
      title: "League of Legends",
      description: "A competitive MOBA game with a wide roster of champions.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg",
    },
    {
      title: "Apex Legends",
      description:
        "A squad-based battle royale with unique heroes and abilities.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/511224-285x380.jpg",
    },
    {
      title: "Valorant",
      description:
        "A tactical FPS game with characters that have unique abilities.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/516575-285x380.jpg",
    },
    {
      title: "Genshin Impact",
      description:
        "An open-world RPG with breathtaking visuals and action gameplay.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/513181-285x380.jpg",
    },
    {
      title: "Roblox",
      description:
        "A platform where users can create and play games made by other users.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/460630-285x380.jpg",
    },
    {
      title: "The Legend of Zelda: Breath of the Wild",
      description:
        "An open-world adventure game full of exploration and puzzles.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/491158-285x380.jpg",
    },
    {
      title: "Cyberpunk 2077",
      description: "A futuristic RPG set in the open-world city of Night City.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/491931-285x380.jpg",
    },
    {
      title: "Overwatch 2",
      description:
        "A team-based hero shooter with intense action and strategy.",
      image: "https://static-cdn.jtvnw.net/ttv-boxart/513143-285x380.jpg",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#232122] text-gray-200 px-4 py-8 sm:px-8"
      id="games"
    >
      {/* Title Section */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-4 text-[#b9a694] font-montserrat">GAMES</h1>
        <p className="text-2xl text-[#69363f] font-bold font-playfair">
          EXPLORE THE MOST POPULAR GAMES AND THEIR AMAZING FEATURES
        </p>
        <Link to="/signup">
        <button className="bg-[#69363f] font-montserrat rounded-full py-3 px-7 my-3 text-base font-semibold text-white hover:bg-[#b9ac9b] cursor-pointer transition-all duration-500 md:w-fit w-full">
          
          Get Started
        </button>
          </Link>
      </div>

      {/* Grid Section */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold font-playfair">{game.title}</h2>
              <p className="text-sm text-gray-400 mt-2 font-montserrat">{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
