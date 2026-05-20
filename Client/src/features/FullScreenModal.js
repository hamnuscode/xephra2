import React from "react";

const FullScreenModal = ({ isOpen, onClose, image }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <button
            className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            onClick={() => onClose()}
          >
            ✕
          </button>
          <img
            src={image}
            alt="Modal Content"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
