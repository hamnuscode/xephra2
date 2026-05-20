import React from "react";
import { IoMoonSharp } from "react-icons/io5";
import { ImBrightnessContrast } from "react-icons/im";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { FiBell } from "react-icons/fi";
const apiUrl = process.env.REACT_APP_BACKEND;

const Header = ({ profile, userData, settings, toggleTheme, toggleSideMenu }) => {
  return (
    <div className={`flex justify-between items-center mb-0 m-0 p-4`}>
      <div className="flex items-center space-x-2">
        {/* Brand name */}
        <span
          className="md:block hidden text-lg font-bold tracking-widest"
          style={{ fontFamily: "IBM Plex Mono, monospace", color: "#00E5FF" }}
        >
          RIVAL
        </span>

        {/* Menu Button - Only visible on small screens */}
        <button
          onClick={toggleSideMenu}
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-white text-white relative"
          aria-label="Menu"
        >
          <BsFillMenuButtonWideFill className="text-white" />{" "}
          <span className="pl-0 text-xl font-bold absolute -bottom-0 left-[23px]">
            Chats
          </span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-white rounded-full focus:outline-none hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Toggle Dark Mode"
        >
          {settings?.dark ? (
            <ImBrightnessContrast className="text-[#C9B796]" />
          ) : (
            <IoMoonSharp className="text-[#C9B796]" />
          )}
        </button>

        {/* Notifications Icon */}
        <button
          className="p-2 text-white rounded-full focus:outline-none hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Notifications"
        >
          <FiBell className="text-[#C9B796]" />
        </button>
        <span className="text-white font-bold">
          {userData?.name || "username"}
        </span>
        <img
          src={
            profile?.profileImage
              ? `${apiUrl}/${profile?.profileImage}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyKxD07vzVrTXqVFK0myyV8KT99ZWBNNwGA&s"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;