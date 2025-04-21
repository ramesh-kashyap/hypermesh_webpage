import { useEffect, useState } from "react";
import axios from "axios";
import Api from "../../Requests/Api";
import TelegramConnectModal from "../../components/TelegramConnectModal";
import {decryptID } from "../../components/cryptoUtils";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import RewardChart from "../../components/RewardChart";
import EmailVerificationModal from "./EmailVerificationModal";

const Dashboard = () => {
   const navigate = useNavigate();
   const [balanceArray, setBalance] = useState([]);
   const [error, setError] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [originalID, setOriginalID] = useState(49);
   const [encryptedID, setEncryptedID] = useState("");
   const [decryptedID, setDecryptedID] = useState("");
   const [username, setUsername] = useState("");
   const [tusername, setTelegramUsername] = useState("");
   const [is_verified, setverified] = useState(true);
   const [is_connected, setConnectd] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isVerifying, setIsVerifying] = useState(false);
   const [loading, setLoading] = useState(true);

   const handleAccept = async () => {
      console.log("User accepted Telegram connection.");
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const decryptedID = decryptID(code);

      try {
         const response = await Api.post('auth/connect-telegram', { telegram_id: decryptedID });
         if (response.data.status) {
            toast.success("Telegram Connected successful!");
            // Navigate to a protected route (e.g., /dashboard)

            navigate('/dashboard');
         }
         else {
            toast.error(response.data.message);
         }


      } catch (err) {

         console.log(err);

         setError(err.response?.data?.error || "Error connect telegram");

      }


      setShowModal(false);
   };

   const handleDecline = () => {
      console.log("User declined Telegram connection.");
      setShowModal(false);
   };


   useEffect(() => {
      fetchbalance();
      // getChartData();/
      fetchUserInfo();
      

   }, []);
   useEffect(() => {
      const fetchData = async () => {
         const urlParams = new URLSearchParams(window.location.search);
         const code = urlParams.get("code");
         console.log(code);
         
         if (code && !is_connected) {
            const decryptedID = decryptID(code);
            console.log("id " + decryptedID);
            try {
               const response = await Api.post('auth/getTelegramId', { telegram_id: decryptedID });
               if (response.data.success) {
                  setTelegramUsername(response.data.user.tname);
               }
            } catch (err) {
               setError(err.response?.data?.error || "Error fetching income");
            }
   
            setShowModal(true);
         }

      };
   
      fetchData();
   }, []); // Dependency array remains empty to run only once

   const fetchbalance = async () => {
      try {
         const response = await Api.get('auth/available-balance');
         setBalance(response.data);
      } catch (err) {
         setError(err.response?.data?.error || "Error fetching income");
      }
   };

   const getChartData = async () => {
      try {
         const response = await Api.get('auth/get-chart-data');

         console.log(response);

      } catch (err) {
         setError(err.response?.data?.error || "Error getChartData income");
      }
   };


   const fetchUserInfo = async () => {
      try {
         const response = await Api.get('auth/userinfo');
         if (response.data.status) {
            setUsername(response.data.name);
            setverified(response.data.is_verify ? true : false)
            localStorage.setItem("is_verified", response.data.is_verify ? true : false); // Save JWT token
            setConnectd(response.data.telegram_id ? true : false)
   
         }
      } catch (err) {
         console.error("❌ Error fetching user info:", err);
      } finally {
         setLoading(false);
      }
   };

   
   const handleVerify = async (code) => {
     try {
      setIsVerifying(true);
      const response = await Api.post("auth/verify-account",{code});
       toast.success(response.data.message); // Backend ka success message show karega
       setTimeout(() => {
         window.location.reload();
       }, 2000);
       setIsVerifying(false);
      } catch (error) {
         const errorMessage = error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : "account verify failed. Please try again.";
            setIsVerifying(false);
         setError(errorMessage);
         toast.error(errorMessage); // Proper error message show karega
      }
  
   };
 
   const handleResend = () => {
     alert("Resending verification code...");
   };
 


   return (


      <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
         {!is_verified && (
            <div class="bg-blue-100 text-blue-800 p-4 rounded-md mb-6"><p>Please verify your account to receive free <b>BNB</b> (used for rewards claiming fee). <a class="font-bold" 
            onClick={() => setIsModalOpen(true)} >Verify Now!</a></p></div>
         )}


               {isModalOpen && (
                     <EmailVerificationModal 
                        onClose={() => setIsModalOpen(false)} 
                        onVerify={handleVerify} 
                        onResend={handleResend} 
                     />
                     )}

         <div className="w-full mt-10 flex flex-col justify-center text-primary">

            {/* model popup/ */}
            <div>
               {showModal && (
                  <TelegramConnectModal
                     username={tusername}
                     onAccept={handleAccept}
                     onDecline={handleDecline}
                  />
               )}
            </div>



            {/* end model */}
            <div className="max-w-[1920px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-white pt-3 px-4 pb-4 rounded-[16px] flex flex-col items-left gap-3">
                  <div className="flex items-center gap-3"><div className="w-[42px] h-[42px] flex items-center justify-center rounded-[12px]" style={{
                     background: 'linear-gradient(rgb(237, 255, 248) 0%, rgb(174, 255, 226) 100%)',
                     width: '48px',
                     marginBottom: '-21px'
                  }}>
                     <img alt="Logo MCC 2" loading="lazy" width="32" height="32" decoding="async" data-nimg="1" src="/icons/icons8-tether.svg" style={{ color: 'transparent', width: '39px' }} />
                  </div><div className="flex flex-col"><p className="text-base text-primary font-bold" style={{ marginTop: '21px' }}>Balance</p>
                        <p className="text-sm text-secondary font-medium">{isNaN(balanceArray.available_balance) ? "0.00" : Number(balanceArray.available_balance).toFixed(2)} USDT</p></div></div>
                  <div className="text-left"><h3 className="font-semibold text-xs leading-[19.2px] mb-1 mt-3">Today Rewards</h3>
                     <p className="text-[28px] leading-[34px] font-semibold" style={{ fontFamily: 'ClashDisplay-Semibold' }}>
                        <span className="overflow-hidden truncate max-w-[80%]"><span>{isNaN(balanceArray.todayReward) ? "0.00" : Number(balanceArray.todayReward).toFixed(3)}</span></span>

                        <span className="text-[14px] leading-[16.8px] text-secondary ml-2" >USDT</span></p>
                  </div>
                  <div className="flex items-center justify-between w-full py-2 px-3 rounded-[12px] bg-[#D5FFF0] border-[#AEFFE2]" style={{ background: ' #b9ffe6' }}>
                     <p className="text-secondary text-xs leading-[19.2px]">Total Rewards</p>
                     <div className="flex text-primary text-xs leading-[19.2px] font-semibold max-w-[50%]">
                        <p className="overflow-hidden truncate"><span>{isNaN(balanceArray.totalReward) ? "0.00" : Number(balanceArray.totalReward).toFixed(2)}</span></p>
                        <p className="ml-1">USDT</p>
                     </div></div></div>


               <div class="bg-white pt-3 px-4 pb-4 rounded-[16px] h-full flex flex-col items-left  gap-3">
                  <div class="flex items-center gap-3">
                     <div class="w-[42px] h-[42px] flex items-center justify-center rounded-[12px]" style={{
                        background: 'linear-gradient(rgb(255, 250, 230) 0%, rgb(255, 232, 138) 100%)', width: '48px',
                        marginBottom: '-21px'
                     }}
                     >
                        <img alt="Logo MCP 2" loading="lazy" width="32" height="32" decoding="async" data-nimg="1" src="/icons/icons8-tether.svg" style={{ color: 'transparent', width: '39px' }} />
                     </div><div class="flex flex-col"><p class="text-base text-primary font-bold" style={{ marginTop: '21px' }}>Team Commission</p>
                        <p class="text-sm text-secondary font-medium">{isNaN(balanceArray.totalCommission) ? "0.00" : Number(balanceArray.totalCommission).toFixed(2)}</p></div></div>
                  <div class="text-left">
                     <h3 class="font-semibold text-xs leading-[19.2px] mb-1 mt-3">Today Commission</h3>
                     <p class="text-[28px] leading-[34px] font-semibold" style={{ fontFamily: 'ClashDisplay-Semibold' }}>
                        <span class="overflow-hidden truncate max-w-[80%]">
                           <span>{isNaN(balanceArray.todayCommission) ? "0.00" : Number(balanceArray.todayCommission).toFixed(2)}</span></span><span class="text-[14px] leading-[16.8px] text-secondary ml-2">USDT</span></p>
                  </div>
                  <div class="flex items-center justify-between w-full py-2 px-3 rounded-[12px] bg-[#FFEFB0] border-[#FFE88A]" style={{ background: 'rgb(249 222 133)' }}>
                     <p class="text-secondary text-xs leading-[19.2px]">Total Referrals</p>
                     <div class="flex text-primary text-xs leading-[19.2px] font-semibold max-w-[50%]">
                        <p class="overflow-hidden truncate">
                           <span>{isNaN(balanceArray.totalReferral) ? "0" : Number(balanceArray.totalReferral)}</span></p><p class="ml-1"></p></div>
                  </div></div>
               <div class="bg-white p-6 max-h-[226px] h-full col-span-full lg:col-span-1 rounded-[16px] flex flex-col justify-between">
                  <div><div class="flex justify-between items-center mb-4">
                     <h3 class="text-[20px] font-medium text-black">Network</h3>
                     <a href="/Team">
                        <button class="text-sm flex items-center px-3 py-1 rounded-[22px] bg-[#F1F1F1]">Manage <span class="ml-1">→</span>
                        </button></a></div>
                  </div>
                  <div class="space-y-2 h-fit">
                     <div class="bg-[#F1F1F1] rounded-[44px] p-3 py-2 flex justify-between items-center">
                        <span class="text-xs">Total Members</span><span class="text-xs">{isNaN(balanceArray.totalMember) ? "0" : Number(balanceArray.totalMember)}</span></div>
                     <div class="bg-[#F1F1F1] rounded-[44px] p-3 py-2 flex justify-between items-center">
                        <span class="text-xs">Total Valid  </span><span class="text-xs">{isNaN(balanceArray.totalValid) ? "0" : Number(balanceArray.totalValid)}</span>
                     </div><div class="bg-[#F1F1F1] rounded-[44px] p-3 py-2 flex justify-between items-center">
                        <span class="text-xs">Team Balance</span><span class="text-xs">${isNaN(balanceArray.teamDesposit) ? "0.00" : Number(balanceArray.teamDesposit).toFixed(2)}</span></div></div></div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="bg-white p-5 rounded-[16px] mt-6 col-span-1 lg:col-span-8">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-black">Reward Stats</h3>
                  {/* <div className="flex bg-gray-200 rounded-[16px] h-[30px]">
                     <button
                     className="flex-1 min-w-[87px] px-4 py-1 text-sm font-medium rounded-full text-center bg-black text-white">Daily</button><button
                        className="flex-1 px-4 py-1 text-sm font-medium rounded-full text-center ">Monthly</button></div> */}



               </div> 
               <RewardChart></RewardChart>
               {/* <div className="flex space-x-4 mt-6">
                  <div className="flex items-center"><span
                     className="w-[22px] h-[22px] bg-green-500 rounded-full mr-2"></span><span
                        className="text-gray-600">Mining</span></div>
                  <div className="flex items-center"><span
                     className="w-[22px] h-[22px] bg-blue-500 rounded-full mr-2"></span><span
                        className="text-gray-600">Referrals</span></div>
                  <div className="flex items-center"><span
                     className="w-[22px] h-[22px] bg-[#FFCC00] rounded-full mr-2"></span><span
                        className="text-gray-600">Tasks</span></div>
               </div> */}
            </div>
            <div className="col-span-1 lg:col-span-4 bg-white rounded-[16px] mt-6 p-5" >
               <h2 className="text-[20px] font-medium text-primary text-center mb-3">Become Resource
                  Provider
               </h2>
               <div className="space-y-4">
                  <a href="https://t.me/hypermesh_bot" target="_blank"
                     className="relative min-h-[70px] h-full text-left w-full py-4 text-white font-semibold bg-[#003724] rounded-[16px] flex items-center justify-center space-x-2 overflow-hidden"
                  >
                     <div className="absolute top-[-50px] inset-0 flex items-center justify-center">
                        <div className="w-[140%] h-[150%] rounded-full opacity-30"
                           style={{
                              backgroundColor: "#0093E9",
                              backgroundImage: "linear-gradient(315deg, #0093E9 0%, #80D0C7 100%)"
                           }}>
                        </div>
                     </div>
                     <div className="w-full"><span className="text-[16px] ml-4">Set Up Telegram Node</span>

                     </div><img alt="Set Up Telegram Node" loading="lazy" width="98" height="98" decoding="async"
                        data-nimg="1" src="/upnl/assets/images/telegram-svgrepo-com.svg"
                        style={{
                           color: 'transparent',
                           position: 'absolute',
                           bottom: '0px',
                           right: '10px',
                           marginBottom: '-5px',
                           opacity: '0.2'
                        }} />
                  </a>
                  <a
                     className="relative min-h-[70px] h-full text-left w-full py-4 text-white font-semibold bg-[#003724] rounded-[16px] flex items-center justify-center space-x-2 overflow-hidden"
                  >
                     <div className="absolute top-[-50px] inset-0 flex items-center justify-center">
                        <div className="w-[140%] h-[150%] rounded-full opacity-30"
                           style={{
                              backgroundColor: '#0093E9',
                              backgroundImage: 'linear-gradient(315deg, #0093E9 0%, #80D0C7 100%)'
                           }}>
                        </div>
                     </div>
                     <div className="w-full"><span className="text-[16px] ml-4">Install Browser
                        Extension</span>
                        <p style={{fontSize:'11px',marginLeft:'19px'}}>Coming Soon</p>
                        
                        </div><img alt="Install Browser Extension" loading="lazy" width="98"
                           height="98" decoding="async" data-nimg="1"
                           src="/upnl/assets/images/server-square-svgrepo-com.svg"
                           style={{
                              color: 'transparent',
                              position: 'absolute',
                              bottom: '0px',
                              right: '10px',
                              marginBottom: '-5px',
                              opacity: '0.2'
                           }} />
                  </a>
                  <a
                     className="relative min-h-[70px] h-full text-left w-full py-4 text-white font-semibold bg-[#003724] rounded-[16px] flex items-center justify-center space-x-2 overflow-hidden"
                  >
                     <div className="absolute top-[-50px] inset-0 flex items-center justify-center">
                        <div className="w-[140%] h-[150%] rounded-full opacity-30"
                           style={{
                              backgroundColor: '#0093E9',
                              backgroundImage: 'linear-gradient(315deg, #0093E9 0%, #80D0C7 100%)'
                           }}>
                        </div>
                     </div>
                     <div className="w-full"><span className="text-[16px] ml-4">Install Desktop Node</span>
                     <p style={{fontSize:'11px',marginLeft:'19px'}}>Coming Soon</p>
                     </div>
                     <img alt="Install Desktop Node" loading="lazy" width="98" height="98" decoding="async"
                        data-nimg="1" src="/upnl/assets/images/extension-puzzle-sharp-svgrepo-com.svg"
                        style={{
                           color: 'transparent',
                           position: 'absolute',
                           bottom: '0px',
                           right: '10px',
                           marginBottom: '-5px',
                           opacity: '0.2'
                        }} />
                  </a>
                  <div className="w-[140%] h-[150%] rounded-full opacity-30"
                     style={{
                        backgroundColor: '#0093E9',
                        backgroundImage: 'linear-gradient(315deg, #0093E9 0%, #80D0C7 100%)'
                     }}>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default Dashboard;