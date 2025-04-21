import React, { useState, useEffect } from "react";
import Api from "../../Requests/Api";
import { Toaster, toast } from "react-hot-toast";
import { Lock, KeyRound, Pencil } from "lucide-react"
import { sendOtp, resetPassword } from "../../Requests/Api"; // Ensure the correct path

const Profile = () => {
    const [isPasswordPopupOpen, setPasswordPopupOpen] = useState(false);
    const [isProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isTrxPasswordPopupOpen, setTrxPasswordPopupOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [newName, setNewName] = useState(""); // ✅ New Name State
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isTelegramConnected, setTelegramConnected] = useState(false);
    const [userIp, setUserIp] = useState(null);
    
    
    const handleTrxPasswordPopupToggle = () => {
        setTrxPasswordPopupOpen(!isTrxPasswordPopupOpen);
    };

    const handlePasswordPopupToggle = () => {
        setPasswordPopupOpen(!isPasswordPopupOpen);
    };

    const handleProfilePopupToggle = () => {
        setProfilePopupOpen(!isProfilePopupOpen);
    };

    // Function to handle outside click and close
    const handleOutsideClick = (event, setPopupState) => {
        if (event.target.id === "popup-overlay") {
            setPopupState(false);
        }
    };

    const handleSendOtp = async () => {
        try {
            const response = await sendOtp(email);

            setMessage(response.message);
            setError("");
            toast.success("Send Otp Successfully");

        } catch (err) {
            console.error("Error in handleSendOtp:", err);
            setError(err.message);
            toast.error("Failed to Send OTP: " + err.message);

        }
    };


    const sendCode = async () => {
        if (loading || countdown > 0) return; // Prevent multiple clicks
        setLoading(true);
        startCountdown(60); // Start 60-second countdown
        try {
          const response = await Api.get("auth/sendCode");
          if (response.data.success) {
            toast.success("OTP sent successfully to your email!");
          } else {
            toast.error("Failed to send OTP. Try again.");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Error sending OTP.");
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

      

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");  // 🔹 Show popup message
            return;
        }
        try {
            const response = await resetPassword(email, code, password);
            setMessage(response.message);
            setError("");
            toast.success("Password Updated Successfully");
            setTimeout(() => {
                window.location.reload();
              }, 3000);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to update Pssword: " + err.message);

        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await Api.get("auth/profile");
                if (response.data) {
                    setUser(response.data);
                    setUserIp(response.data.ip);
                    setNewName(response.data.name);
                    setEmail(response.data.email);
                    setTelegramConnected(response.data.telegram_id?true:false);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const response = await Api.put("auth/Update-Profile", { name: newName });

            if (response.data) {
                setUser((prevUser) => ({ ...prevUser, name: newName }));
                toast.success("Profile Updated Successfully");
                window.location.reload();


            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <><Toaster position="top-center" />
            <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
                <div className="w-full flex justify-center text-primary">
                    <div className="flex flex-col md:flex-row max-w-[1920px] w-full mt-5 lg:mt-[100px] mx-auto justify-center">
                        <div className="w-full relative md:max-w-[669px] pb-[46px] text-center pt-[36px] bg-[#FFF] rounded-[16px]">
                            <div
                                className="w-[100px] h-[100px] rounded-full mx-auto text-[72px] font-semibold"
                                style={{ background: "rgb(64, 195, 255)", fontFamily: "ClashDisplay-Semibold" }}
                            >
                                {newName ? newName.charAt(0).toUpperCase() : "P"}

                            </div>
                            <button className="absolute right-10 top-10" onClick={handleProfilePopupToggle}>
                                <Pencil size={30} />            </button>
                            <div
                                className="mx-auto w-full text-primary text-[28px] font-semibold"
                                style={{ fontFamily: "ClashDisplay-Semibold" }}
                            >{newName}
                            </div>
                            <div className="mx-auto w-full text-secondary text-sm mb-[24px]">
                                {email}
                            </div>
                            <div className="mx-auto w-full text-secondary text-sm mb-[24px]">
                                Login IP : {userIp}
                            </div>
                            
                            <div className="flex mx-auto w-full justify-center">
                                <a >
                                    <button className="flex flex-1 justify-center rounded-[30px] max-w-[200px] h-[48px] py-3 px-6 bg-[#F1F1F1]" onClick={handlePasswordPopupToggle}>
                                        <KeyRound size={20} />
                                        <span className="ml-[10px] text-[16px] font-semibold"> &nbsp; Password</span>
                                    </button>
                                </a>
                                {/* <a >
                                    <button className="flex flex-1 ml-2 md:ml-4 justify-center rounded-[30px] max-w-[200px] h-[48px] py-3 px-6 bg-[#F1F1F1]" onClick={handleTrxPasswordPopupToggle}>
                                        <Lock size={20} />
                                        <span className="ml-[10px] text-[16px] font-semibold">Security</span>
                                    </button>
                                </a> */}
                            </div>
                        </div>

                        <div  className="md:ml-6 mt-6 md:mt-0 p-6 rounded-[16px] w-full md:max-w-[308px] bg-[#FFF] flex flex-col gap-4">
                        <div className="flex flex-col w-full p-4 bg-[#F9F9F9] rounded-[16px] h-[137px]" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                                <div className="flex flex-col items-center justify-center w-full h-[72px] space-y-2">
                                    <div className="relative w-[38px] h-[38px] rounded-full border-[3px] border-white bg-white flex items-center justify-center">
                                        <img alt="Connect Telegram" width="24" height="24" className="rounded-full" src="upnl/assets/icons/icon_telegram_2.svg" />
                                    </div>
                                    <span className="text-[16px] font-semibold" style={{ fontFamily: "Poppins" }}>
                                        Connect Telegram
                                    </span>
                                </div>
                                {isTelegramConnected ? (
                                            <div 
                                                className="bg-[#171717] mt-2 cursor-pointer text-white py-3 px-4 h-[30px] rounded-[20px] flex justify-center items-center" 
                                                style={{
                                                    border: "1px solid rgb(241, 241, 241)", 
                                                    background: "rgb(255 255 255 / var(--tw-bg-opacity))", 
                                                    width: "120px", 
                                                    margin: "0px auto", 
                                                    marginTop: "10px"
                                                }}
                                            >
                                                <img 
                                                    alt="Connected Icon" 
                                                    loading="lazy" 
                                                    width="16" 
                                                    height="16" 
                                                    decoding="async" 
                                                    data-nimg="1" 
                                                    className="mr-1" 
                                                    src="/icons/check-circle.svg" 
                                                    style={{ color: "transparent" }} 
                                                />
                                                <span className="font-medium text-black text-[12px]">Connected</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <a href="https://t.me/hypermesh_bot" target="_blank">
                                                    <button className="bg-[#171717] mt-2 cursor-pointer text-white py-3 px-4 h-[30px] rounded-[20px] flex justify-center items-center">
                                                        <span style={{ color: "white" }} className="text-[14px]">Connect</span>
                                                    </button>
                                                </a>
                                            </div>
                                        )}


                            </div>

                            <div className="flex flex-col w-full p-4 bg-[#F9F9F9] rounded-[16px] h-[137px]" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                                <div className="flex flex-col items-center justify-center w-full h-[72px] space-y-2">
                                    <div className="relative w-[38px] h-[38px] rounded-full border-[3px] border-white bg-white flex items-center justify-center">
                                        <img alt="Connect X (Twitter)" width="24" height="24" className="rounded-full" src="/upnl/assets/icons/icon-wallet.svg" />
                                    </div>
                                    <span className="text-[16px] font-semibold" style={{ fontFamily: "Poppins" }}>
                                      How to Start
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <a href="https://hypermesh.gitbook.io/hypermesh/basics/how-to-use/how-to-sign-up" target="_blank">
                                        <button className="bg-[#171717] mt-2 cursor-pointer text-white py-3 px-4 h-[30px] rounded-[20px] flex justify-center items-center">
                                            <span style={{ color: "white" }} className="text-[14px]">Connect</span>
                                        </button>
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col w-full p-4 bg-[#F9F9F9] rounded-[16px] h-[137px]" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                                <div className="flex flex-col items-center justify-center w-full h-[72px] space-y-2">
                                    <div className="relative w-[38px] h-[38px] rounded-full border-[3px] border-white bg-white flex items-center justify-center">
                                        <img alt="Connect Discord" width="24" height="24" className="rounded-full" src="/upnl/assets/icons/customer-service.svg" />
                                    </div>
                                    <span className="text-[16px] font-semibold" style={{ fontFamily: "Poppins" }}>
                                        Connect Support
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <a href="https://t.me/samuelkei" target="_blank">
                                        <button className="bg-[#171717] mt-2 cursor-pointer text-white py-3 px-4 h-[30px] rounded-[20px] flex justify-center items-center">
                                            <span style={{ color: "white" }} className="text-[14px]">Connect</span>
                                        </button>
                                    </a>
                                </div>
                            </div>

                            {/* <div className="flex flex-col w-full p-4 bg-[#F9F9F9] rounded-[16px] h-[137px]" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                                <div className="flex flex-col items-center justify-center w-full h-[72px] space-y-2">
                                    <div className="relative w-[38px] h-[38px] rounded-full border-[3px] border-white bg-white flex items-center justify-center">
                                        <img alt="Connect Web3 Wallet" width="24" height="24" className="rounded-full" src="upnl/assets/icons/icon-wallet.svg" />
                                    </div>
                                    <span className="text-[16px] font-semibold" style={{ fontFamily: "Poppins" }}>
                                        Connect Web3 Wallet
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <a href="https://t.me/meshrockbot">
                                        <button className="bg-[#171717] mt-2 cursor-pointer text-white py-3 px-4 h-[30px] rounded-[20px] flex justify-center items-center">
                                            <span style={{ color: "white" }} className="text-[14px]">Connect</span>
                                        </button>
                                    </a>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                {isPasswordPopupOpen && (

                    <div id="popup-overlay" onClick={(e) => handleOutsideClick(e, setPasswordPopupOpen)} className="fixed inset-0 flex items-center justify-center bg-black1 bg-opacity-50">

                        <form>
                            <input type="hidden" name="_token" value="KKX0De0b1aF69ZyhV4ctcUqPaDEGxVrpSEIoZILh" />
                            <div className="bg-white rounded-[20px] w-[400px] px-8 pt-10 pb-6 text-center relative">

                                <h2 className="text-lg font-semibold">Change Password</h2>
                                <div className="mb-4 mt-8 text-left">
                                    <label className="block text-gray-600 mb-1">Email</label>
                                    <input type="email" placeholder="Please enter the email" value={email} onChange={(e) => setEmail(e.target.value)} id="emailId" name="emailId" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mb-4 mt-8 text-left">
                                    <label className="block text-gray-600 mb-1">Verification Code</label>
                                    <div className="input-container" style={{ position: 'relative', width: '100%' }}>
                                        <input type="text" name="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter verification code" className="w-full px-3 py-2 border border-gray-300 rounded-[12px] pr-20" />
                                        <span className="code-btn"
                                            onClick={sendCode} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'gray' }}
                                            >
                                            {countdown > 0 ? `Wait ${countdown}s` : "Get Code"}
                                            </span>
                                    </div>
                                </div>
                                <div className="mb-4 mt-4 text-left">
                                    <label className="block text-gray-600 mb-1">New Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Please enter the new password" name="password" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mb-4 mt-4 text-left">
                                    <label className="block text-gray-600 mb-1">Confirm Password</label>
                                    <input type="password" placeholder="Enter the password again to confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="password_confirmation" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mt-10">
                                    <button onClick={handleResetPassword} className="w-full h-[46px] mb-2 px-4 py-2 rounded-[30px] bg-blue-500 text-white">Confirm</button>
                                    <a onClick={handlePasswordPopupToggle} className="w-full h-[46px] px-4 py-2 rounded-[30px] bg-gray-300 inline-block text-center">Cancel</a>
                                </div>
                            </div>
                        </form>
                    </div>
                )}


                {isTrxPasswordPopupOpen && (
                    <div id="popup-overlay" onClick={(e) => handleOutsideClick(e, setTrxPasswordPopupOpen)} className="fixed inset-0 flex items-center justify-center bg-black1 bg-opacity-50">
                        <form>
                            <input type="hidden" name="_token" value="KKX0De0b1aF69ZyhV4ctcUqPaDEGxVrpSEIoZILh" />
                            <div className="bg-white rounded-[20px] w-[400px] px-8 pt-10 pb-6 text-center relative">
                                <h2 className="text-lg font-semibold">Change Transaction Password</h2>
                                <div className="mb-4 mt-8 text-left">
                                    <label className="block text-gray-600 mb-1">Email</label>
                                    <input type="text" placeholder="Please enter the new password" value="kumar@gmail.com" id="emailId" name="emailId" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mb-4 mt-8 text-left">
                                    <label className="block text-gray-600 mb-1">Verification Code</label>
                                    <div className="input-container" style={{ position: 'relative', width: '100%' }}>
                                        <input type="text" name="code" placeholder="Enter verification code" className="w-full px-3 py-2 border border-gray-300 rounded-[12px] pr-20" />
                                        <span className="code-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'gray' }}>
                                            Get Code
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4 mt-4 text-left">
                                    <label className="block text-gray-600 mb-1">New Password</label>
                                    <input type="password" placeholder="Please enter the new password" name="password" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mb-4 mt-4 text-left">
                                    <label className="block text-gray-600 mb-1">Confirm Password</label>
                                    <input type="password" placeholder="Enter the password again to confirm" name="password_confirmation" className="w-full px-3 py-2 border border-gray-300 rounded-[12px]" />
                                </div>
                                <div className="mt-10">
                                    <button className="w-full h-[46px] mb-2 px-4 py-2 rounded-[30px] bg-blue-500 text-white">Confirm</button>
                                    <a onClick={handleTrxPasswordPopupToggle} className="w-full h-[46px] px-4 py-2 rounded-[30px] bg-gray-300 inline-block text-center">Cancel</a>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit Profile Modal */}
                {isProfilePopupOpen && (
                    <div id="popup-overlay" onClick={(e) => handleOutsideClick(e, setProfilePopupOpen)} className="fixed inset-0 flex items-center justify-center bg-black1 bg-opacity-50">
                        <div className="bg-white rounded-[20px] w-[400px] px-8 pt-10 pb-6 text-center relative">
                            <h2 className="text-lg font-semibold">Edit Profile</h2>
                            <div className="w-[100px] my-10 h-[100px] mx-auto cursor-pointer">
                                <div className="w-full h-full rounded-full mx-auto text-[72px] font-semibold"
                                    style={{ background: 'rgb(45, 169, 221)', fontFamily: 'ClashDisplay-Semibold' }}>
                                    {user?.name.charAt(0).toUpperCase() || "U"}
                                </div>
                            </div>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[12px]"
                                    placeholder="Enter Full Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)} />
                            </div>
                            <div className="mt-10">
                                <button onClick={handleUpdateProfile} disabled={loading} className="w-full h-[46px] mb-2 px-4 py-2 rounded-[30px] bg-blue-500 text-white">
                                    Save
                                </button>
                                <button
                                    className="w-full h-[46px] px-4 py-2 rounded-[30px] bg-gray-300"
                                    onClick={handleProfilePopupToggle}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;