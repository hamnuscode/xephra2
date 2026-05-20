import React from "react";
import { Link } from "react-router-dom";

const games = [
  { id: 1, title: "PUBG: Battlegrounds", image: "https://static-cdn.jtvnw.net/ttv-boxart/493057-285x380.jpg" },
  { id: 2, title: "Fortnite", image: "https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg" },
  { id: 3, title: "Free Fire", image: "https://static.digit.in/default/7793d6be1d182149915ee40070d01cdba3a39550.jpeg" },
  { id: 4, title: "League of Legends", image: "https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg" },
  { id: 5, title: "Dota 2", image: "https://pbs.twimg.com/media/GY15XvZaIAALJTj.png" },
  { id: 6, title: "FIFA", image: "https://images.lifestyleasia.com/wp-content/uploads/sites/6/2022/05/11160836/fifa-22-official-gameplay-trailer_z7b6.1200.jpg" },
  { id: 7, title: "Chess", image: "https://chessbazaar.gumlet.io/media/catalog/product/cache/c249699911720c504823772501a8e5ee/r/i/ridle_series_chess_pieces_in_ebony_2_.jpg" },
  { id: 8, title: "Call of Duty: Warzone", image: "https://static-cdn.jtvnw.net/ttv-boxart/512710-285x380.jpg" },
  { id: 9, title: "Cyberpunk 2077", image: "https://static-cdn.jtvnw.net/ttv-boxart/491931-285x380.jpg" },
  { id: 10, title: "Rainbow Six Siege", image: "https://static-cdn.jtvnw.net/ttv-boxart/460630-285x380.jpg" },
];

const GamesCardsV2 = () => {
  return (
    <section className="py-24 px-6" style={{ background: "rgba(6, 9, 25, 0.8)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(0, 229, 255, 0.06)",
              border: "1px solid rgba(0, 229, 255, 0.15)",
              color: "#00E5FF",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            Featured Games
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA", letterSpacing: "-0.02em" }}
          >
            Games We Support
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Explore popular games and compete for exclusive prizes in our tournament arena.
          </p>
          <Link to="/signup" className="btn-primary py-3 px-8 text-sm inline-block">
            Get Started
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
              style={{ aspectRatio: "3/4" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,229,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
              }}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                  background: "linear-gradient(to top, rgba(10,14,39,0.95) 0%, rgba(10,14,39,0.3) 50%, transparent 100%)",
                }}
              />
              {/* Cyan border on hover */}
              <div
                className="absolute inset-0 rounded-lg border transition-all duration-200 opacity-0 group-hover:opacity-100"
                style={{ border: "1px solid rgba(0,229,255,0.5)" }}
              />
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3
                  className="text-sm font-semibold leading-tight transition-colors duration-200"
                  style={{
                    color: "#F8F9FA",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {game.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesCardsV2;
