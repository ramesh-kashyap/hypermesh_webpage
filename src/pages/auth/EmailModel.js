import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Api from "../../Requests/Api";

const EmailModel = ({ onClose, onSendCode, onVerify,email }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    setLoading(true);
    if (loading || countdown > 0) return; // Prevent multiple clicks
    setLoading(true);
    startCountdown(60); // Start 60-second countdown
    try {
        const response = await Api.get("auth/sendCodeForget", {
            params: { email }
          });
      if (response.data.success) {
        setCodeSent(true);
        toast.success("OTP sent successfully to your email!");
      } else {
        toast.error("Failed to send OTP. Try again.");
      }
    } catch (error) {
        setCodeSent(false);
      console.log("Error:", error.response.data);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-w-[90%]">
        {/* Header Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">Verify Your Email</h2>
          <button onClick={onClose} className="focus:outline-none">
            <img
              alt="Close"
              loading="lazy"
              width={18}
              height={18}
              src="/icons/icon_close.svg"
              className="max-w-[18px] h-auto"
            />
          </button>
        </div>

        {/* Show Send Code Button First */}
        {!codeSent ? (
          <>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Click the button below to receive a verification code in your email.
            </p>
            <button
              onClick={handleSendCode}
              className="w-full bg-green-500 text-white py-2 rounded-[30px] hover:bg-green-600 transition"
            >
                {countdown > 0 ? `Sending...` : "Send Code"}
            </button>
          </>
        ) : (
          <>
            {/* After Code is Sent */}
            <p className="text-sm text-gray-600 mb-4 text-center">
              We have sent a 6-digit code to your email. Please enter it below:
            </p>

            {/* Code Input */}
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit code"
              className="w-full p-2 border border-gray-300 rounded-[12px] mb-4 text-center text-xl"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {/* Verify Now Button */}
            <button
              onClick={() => onVerify(code)}
              className="w-full bg-green-500 text-white py-2 rounded-[30px] hover:bg-green-600 transition"
              disabled={code.length !== 6}
            >
              Verify Now
            </button>

            {/* Resend Code Option */}
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button onClick={handleSendCode} className={`text-gray-800 underline text-[14px] font-semibold  ${countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}>
                {countdown > 0 ? `Wait ${countdown}s` : "Resend"}
                </button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailModel;