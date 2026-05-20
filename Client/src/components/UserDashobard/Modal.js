import React from 'react';

const Modal = ({ isOpen, onClose, profile }) => {
    const baseUrl = process.env.REACT_APP_BACKEND;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Gamer Profile</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl">&times;</button>
    </div>
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <img src={`${baseUrl}/${profile?.data?.profileImage}`} alt="Profile" className="w-24 h-24 object-cover rounded-full border-4 border-gray-700" />
        <div>
          <h3 className="text-xl font-semibold">{profile?.data?.name}</h3>
          <p className="text-gray-400">@{profile?.data?.username}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Full Name:</strong> {profile?.data?.fullName}</p>
          <p><strong>Bio:</strong> {profile?.data?.bio}</p>
          <p><strong>Email:</strong> {profile?.data?.email}</p>
          <p><strong>Age:</strong> {profile?.data?.age}</p>
        </div>
        <div>
          <p><strong>Address:</strong> {profile?.data?.address}</p>
          <p><strong>City:</strong> {profile?.data?.locationCity}</p>
          <p><strong>Number:</strong> {profile?.data?.phoneNumber}</p>
          <p><strong>Country:</strong> {profile?.data?.locationCountry}</p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Modal;