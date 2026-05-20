import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = ({ scrollToSection, refs }) => {
  const { homeRef, gameRef, tournamentsRef, priceRef } = refs;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClicked = (ref) => {
    setIsMenuOpen(!isMenuOpen);
    scrollToSection(ref);
  };

  return (
    <nav className="bg-[#69363f] border-gray-200 dark:bg-[#69363f] sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-12 w-24 " alt="Flowbite Logo" />
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            user && user.role === "admin" ? (
              <Link
                to="/dashboard"
                type="button"
                className="text-white font-montserrat bg-[#b7a692] hover:bg-[#b9ac9b]  focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-[#b7a692] dark:bg-[#b7a692]-700 dark:focus:bg-[#b7a692]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/userdashboard"
                type="button"
                className="text-white font-montserrat bg-[#b7a692] hover:bg-[#b9ac9b]  focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-[#b7a692] dark:bg-[#b7a692]-700 dark:focus:bg-[#b7a692]"
              >
                Dashboard
              </Link>
            )
          ) : (
            <Link
              to="/signup"
              type="button"
              className="text-white font-montserrat bg-[#b7a692] hover:bg-[#b9ac9b]  focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-[#b7a692] dark:bg-[#b7a692]-700 dark:focus:bg-[#b7a692]"
            >
              Get started
            </Link>
          )}

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border  rounded-lg bg-[#69363f] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#69363f] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="#"
                onClick={() => handleClicked(homeRef)}
                className="block font-montserrat py-2 px-3 md:p-0 text-white  rounded md:bg-transparent md:text-white md:dark:text-white md:hover:text-[#b9ac9b] md:dark:hover:text-[#b9ac9b] focus:text-[#b9ac9b]"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#games"
                onClick={() => handleClicked(gameRef)}
                className="block font-montserrat py-2 px-3 md:p-0 text-white rounded  md:hover:text-[#b9ac9b] md:dark:hover:text-[#b9ac9b] focus:text-[#b9ac9b] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={() => handleClicked(tournamentsRef)}
                className="block font-montserrat py-2 px-3 md:p-0 text-white rounded   md:hover:text-[#b9ac9b] md:dark:hover:text-[#b9ac9b] focus:text-[#b9ac9b] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Tournaments
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={() => handleClicked(priceRef)}
                className="block font-montserrat py-2 px-3 md:p-0 text-white rounded  md:hover:text-[#b9ac9b] md:dark:hover:text-[#b9ac9b] focus:text-[#b9ac9b] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Prices
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
