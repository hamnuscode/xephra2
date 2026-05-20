import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { RiAdminLine } from "react-icons/ri";
import {
  getAdminUserChatGroup,
  fetchAdminChatGroups,
  fetchAdminUserSingleChats
} from "../../redux/features/ChatsSlice";

const Sidebar = ({
  sideMenuRef,
  settings,
  searchTerm,
  setSearchTerm,
  filteredChatGroups,
  activeChat,
  loading,
  unreadMessages,
  handleSelectChat,
}) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(null);
  const [privateChats, setPrivateChats] = useState([]);
  const { adminChatGroups, data, error } = useSelector((state) => state.chatGroups);

  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    if (adminId) {
      dispatch(fetchAdminChatGroups(adminId));
      dispatch(fetchAdminUserSingleChats(adminId));
    }
  }, [dispatch, adminId]);

  useEffect(() => {
    // Retrieve user information from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserRole(storedUser.role);
      if (storedUser.role === "admin") {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setAdminId(userData?.UserId);
      }
    }
  }, []);


  // Handle admin chat selection
  const handleAdminChatSelect = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.UserId;
     
    
    if (userId) {
      try {
        const resultAction = await dispatch(getAdminUserChatGroup(userId));

        if (getAdminUserChatGroup.fulfilled.match(resultAction)) {
          const adminChat = {
            _id: resultAction.payload._id || "admin-chat",
            name: "Admin Support",
            isAdminChat: true,
            lastMessage: resultAction.payload.lastMessage || {
              text: "Contact admin for support",
            },
          };

          handleSelectChat(adminChat);
        } else {
          console.error("Failed to fetch admin chat", resultAction.payload);
        }
      } catch (error) {
        console.error("Error selecting admin chat", error);
      }
    }
  };
  // Handle admin chat selection
  const handleAdminChatSelect2 = async (chat) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.UserId;
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;
     
    if(userRole === "admin"){
      const adminChat = {
        _id: chat._id,
        name: "Admin Support",
        isAdminChat: true,
        lastMessage:  {
          text: "Contact admin for support",
        },
      };

      handleSelectChat(adminChat);
    }

    if (userId) {
      try {
        const resultAction = await dispatch(getAdminUserChatGroup(userId));

        if (getAdminUserChatGroup.fulfilled.match(resultAction)) {
          const adminChat = {
            _id: resultAction.payload._id || "admin-chat",
            name: "Admin Support",
            isAdminChat: true,
            lastMessage: resultAction.payload.lastMessage || {
              text: "Contact admin for support",
            },
          };

          handleSelectChat(adminChat);
        } else {
          console.error("Failed to fetch admin chat", resultAction.payload);
        }
      } catch (error) {
        console.error("Error selecting admin chat", error);
      }
    }
  };

  console.log("data", data);
  // Render different sidebar for admin
  if (userRole === "admin") {
    return (
      <div
        ref={sideMenuRef}
        className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out
          ${settings.isSideMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          ${settings.dark ? "bg-[#21201e52]" : "bg-[#000000]"}
          md:relative md:translate-x-0 md:block md:ml-3 ml-0`}
      >
        {/* Search */}
        <div className="relative w-[90%] m-4">
          <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 bg-[#C9B79670] text-white px-4 py-2 rounded-full focus:outline-2 focus:outline-white backdrop-blur-md`}
          />
        </div>

        {/* Private Chats Section */}
        <div className="text-white text-2xl font-bold mb-3 ml-5">
          Private Chats
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="text-white text-center p-4">
              Loading private chats...
            </div>
          ) : data?.chatGroups.length === 0 ? (
            <div className="text-white text-center p-4">No private chats</div>
          ) : (
            data?.chatGroups.map((chat) => (
              <div
                key={chat.chatGroupId}
                onClick={()=>handleAdminChatSelect2(chat)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer backdrop-blur-md hover:bg-neutral-700/50 ${
                  activeChat?._id === chat._id ? "bg-neutral-700/70" : ""
                } relative`}
              >
                {/* Private chat item rendering similar to group chats */}
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    <img  src={`${process.env.REACT_APP_BACKEND}/${chat?.userProfile?.profileImage}`} className="rounded-3xl" />
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#D19F43] font-medium">{chat?.userProfile?.username}</h3>
                  <p className="text-neutral-400 text-sm truncate">
                    {chat.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Groups Section */}
        <div className="text-white text-2xl font-bold mb-3 ml-5">
          Chat Groups
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="text-white text-center p-4">
              Loading chat groups...
            </div>
          ) : adminChatGroups.length === 0 ? (
            <div className="text-white text-center p-4">
              No chat groups found
            </div>
          ) : (
            adminChatGroups.map((group) => (
              <div
                key={group._id}
                onClick={() => handleSelectChat(group)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer backdrop-blur-md hover:bg-neutral-700/50 ${
                  activeChat?._id === group._id ? "bg-neutral-700/70" : ""
                } relative`}
              >
                {/* Existing group chat rendering */}
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {group.name?.[0] || "G"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#D19F43] font-medium">{group.name}</h3>
                  <p className="text-neutral-400 text-sm truncate">
                    {group.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dashboard Button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
          <Link to={"/userdashboard"} className="w-full max-w-[100%]">
            <button className="w-full bg-[#69363F] p-7 border-[#C9B796] border-[1px] text-[#C9B796] py-2 rounded-lg hover:bg-neutral-700/50 transition-colors backdrop-blur-m">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Regular user sidebar (existing implementation)
  return (
    <div
      ref={sideMenuRef}
      className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out
        ${settings.isSideMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        ${settings.dark ? "bg-[#21201e52]" : "bg-[#000000]"}
        md:relative md:translate-x-0 md:block md:ml-3 ml-0`}
    >
      {/* Search */}
      <div className="relative w-[90%] m-4">
        <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 bg-[#C9B79670] text-white px-4 py-2 rounded-full focus:outline-2 focus:outline-white backdrop-blur-md`}
        />
      </div>

      {/* Admin Chat Option - Above Groups */}
      <div
        onClick={handleAdminChatSelect}
        className={`flex items-center space-x-3 p-3 mx-3 mb-4 rounded-lg cursor-pointer backdrop-blur-md hover:bg-neutral-700/50 ${
          activeChat?.isAdminChat ? "bg-neutral-700/70" : ""
        } relative`}
      >
        <div className="w-10 h-10 bg-[#69363F] rounded-full flex items-center justify-center">
          <RiAdminLine className="text-white text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-[#D19F43] font-medium">Admin Support</h3>
          <p className="text-neutral-400 text-sm truncate">
            Direct support channel
          </p>
        </div>

        {/* New message indicator for admin chat */}
        {unreadMessages["admin-chat"] > 0 && (
          <div className="absolute top-2 right-2 bg-[#D19F43] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadMessages["admin-chat"]}
          </div>
        )}
      </div>

      {/* Groups */}
      <div className="text-white text-2xl font-bold mb-3 ml-5">Groups</div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {loading ? (
          <div className="text-white text-center p-4">
            Loading chat groups...
          </div>
        ) : filteredChatGroups.length === 0 ? (
          <div className="text-white text-center p-4">No chat groups found</div>
        ) : (
          filteredChatGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleSelectChat(group)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer backdrop-blur-md hover:bg-neutral-700/50 ${
                activeChat?._id === group._id ? "bg-neutral-700/70" : ""
              } relative`}
            >
              <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">
                  {group.name?.[0] || "G"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[#D19F43] font-medium">{group.name}</h3>
                <p className="text-neutral-400 text-sm truncate">
                  {group.lastMessage?.text || "No messages yet"}
                </p>
              </div>
              <span className="text-neutral-500 text-xs">
                {group.lastMessage?.time || ""}
              </span>

              {/* New message indicator */}
              {unreadMessages[group._id] > 0 && (
                <div className="absolute top-2 right-2 bg-[#D19F43] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages[group._id]}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Dashboard Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
        <Link to={"/userdashboard"} className="w-full max-w-[100%]">
          <button className="w-full bg-[#69363F] p-7 border-[#C9B796] border-[1px] text-[#C9B796] py-2 rounded-lg hover:bg-neutral-700/50 transition-colors backdrop-blur-m">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
