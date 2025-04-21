import React, { useState } from "react";

const ResetPasswordModal = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg text-center shadow-lg p-6 w-[400px] max-w-[90%]">
        <h2
          className="text-[28px] font-semibold text-gray-800 text-center mb-2"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-600 mb-4">Please choose a new password:</p>

        <div className="text-left">
          <div className="w-full mb-5">
            <label htmlFor="password" className="block mb-[4px] text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="mt-1 h-[48px] block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="w-full mb-5">
            <label htmlFor="confirmPassword" className="block mb-[4px] text-sm font-medium text-gray-700">
              Repeat Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Enter Password"
              className="mt-1 h-[48px] block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div id="cf-turnstile" className="flex items-center justify-center mb-3">
          <input
            type="hidden"
            name="cf-turnstile-response"
            id="cf-chl-widget-response"
            value="turnstile-token"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-[30px] hover:bg-green-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;