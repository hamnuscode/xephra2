import React from "react";
import { Link } from "react-router-dom";

export default function Herosection() {
  return (
    <>
      <section className="pt-0 h-full">
        <div className=" bg-[#232122] py-10 overflow-hidden  lg:m-0 2xl:py-16 xl:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12 lg:gap32">
              <div className="w-full xl:col-span-5 lg:col-span-6 2xl:-mx-5 xl:-mx-0">
                <div className="flex items-center text-sm font-medium text-white justify-center lg:justify-start">
                  <span className="bg-[#69363f] font-montserrat py-1 px-3 rounded-2xl text-xs font-medium text-white mr-3 font-montserrat">
                    #1
                  </span>
                  Gaming Tournament Platform
                </div>
                <h1 className="font-playfair  py-8 text-center text-[#b7a692] font-bold font-manrope text-3xl md:text-5xl text-center lg:text-left leading-[70px]">
                  WHERE GAMERS COMPETE FOR GLORY
                  <span className="text-[#69363f]">
                    {" "}
                    ENTER THE TOURNAMENT ARENA!
                  </span>
                </h1>
                <p className=" text-[#b7a692] text-lg text-center lg:text-left font-montserrat">
                  Compete, rank up, and win amazing rewards in epic tournaments!
                </p>
                <div className="flex mt-3 justify-start">
                <Link to="/signup" className="bg-[#69363f] font-montserrat rounded-full py-3 px-7 text-base font-semibold text-white hover:bg-[#b9ac9b] cursor-pointer transition-all duration-500 md:w-fit w-full">
                  Get Started
                </Link>
                </div>
              </div>
              <div className="w-full xl:col-span-7  lg:col-span-6 block">
                <div className="w-full  sm:w-auto lg:w-[60.8125rem] xl:ml-16">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Dashboard image"
                    className="rounded-l-3xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
