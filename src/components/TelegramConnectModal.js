import React from "react";

const TelegramConnectModal = ({ username = "Sachin Prajapati", onAccept, onDecline }) => {
  return (
    <div className="fixed z-[999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-[20px] shadow-lg w-fit text-center">
        {/* Modal Header */}
        <h2 className="text-lg font-semibold mb-2">Connect Telegram Account</h2>
        <p className="text-sm text-secondary">Connect your account with Telegram:</p>

        {/* Username Display */}
        <p className="mb-4">{username}</p>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <button 
            className="px-4 w-1/2 py-2 bg-gray-300 rounded-[30px]" 
            onClick={onDecline}
          >
            Decline
          </button>
          <button  style={{color:'#fff'}}
            className="px-4 w-1/2 py-2 bg-black text-white rounded-[30px]" 
            onClick={onAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramConnectModal;