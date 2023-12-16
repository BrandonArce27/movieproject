import React from "react";

interface OverviewPopupProps {
  overview: string;
  onClose: () => void;
}

const OverviewPopup: React.FC<OverviewPopupProps> = ({ overview, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p>{overview}</p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OverviewPopup;
