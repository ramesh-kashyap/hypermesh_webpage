import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import { Toaster, toast } from "react-hot-toast";
import { ChevronDown } from "lucide-react";

import axios from "axios";
import Api from "../../Requests/Api";
const networkOptions = [
   
    {
      name: "USDT BEP20",
      logo: "upnl/assets/icons/bnb-logo.png",
    },
    {
        name: "USDT TRC20",
        logo: "upnl/assets/icons/tron-logo.png",
      }
  ];

const RechargeFunds = () => {
    const [selectedOption, setSelectedOption] = useState(networkOptions[0]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(""); 
    const [buttonText, setButtonText] = useState("Deposit Now");

    const [users, setUsers] = useState([]); // ✅ Always start with an empty array
    const [error, setError] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isBinanceVisible, setBinanceVisible] = useState(false);
    const [isEthereumVisible, setEthereumVisible] = useState(false);
    const [blockchain, setBlockchain] = useState("USDT BEP20");
    const [walletAddress, setWalletAddress] = useState("");
    const [qrCode, setQrcode] = useState("");
    const [copied, setCopied] = useState(false);
    const [copied2, setCopied2] = useState(false);
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(0);
    const [vip, setVip] = useState(null);
    useEffect(() => {
        fetchUsers();        
    }, []);

    const Rank = {
        0: 'Member',
        1: 'Starter',
        2: 'Advanced',
        3: 'Elite',
        4: 'Expert',
        5: 'Legend',
      };
    
    
    const fetchUsers = async () => {
        try {
            const response = await Api.get("auth/deposit-History");
    
            if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else {
                setUsers([]); 
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching income");
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchbalance();
      }, []);
    
      const fetchUserInfo = async () => {
        try {
          const response = await Api.get('auth/userinfo');
          if (response.data.status) {
            setVip(response.data.vip);
          }
        } catch (err) {
          console.log("❌ Error fetching user info:", err);
        }
      };
    
    
      const fetchbalance = async () => {
        try {
           const response = await Api.get('auth/available-balance');
           setBalance(response.data.totlinvest?response.data.totlinvest:0);
        } catch (err) {
           setError(err.response?.data?.error || "Error fetching income");
        }
     };
    

    const handleRecharge = async () => {
        try {
            setButtonText("Processing...");

            const vipLimits = {
                0: 500,
                1: 500,
                2: 1000,
                3: 3000,
                4: 5000,
                5: 10000,
                6: 100000,
                // Add more VIP levels if needed
            };
            
            const currentLimit = vipLimits[vip];
            console.log(balance);
            
            const newTotal = parseFloat(balance) + parseFloat(amount);
            let nmt = currentLimit- balance
               nmt = nmt > 0 ? nmt : 0;
            
               
            // Check if the new total exceeds the VIP limit
            if (newTotal > currentLimit) {
                // alert(`Deposit limit exceeded for your VIP rank ${Rank[vip]}. Max allowed: ${currentLimit}`);
                toast.error(`Deposit limit exceeded for  ${Rank[vip]}. Max allowed: ${nmt} USDT`); // Proper error message show karega
                setButtonText("Deposit Now");
                return;
            }

          

          const response = await Api.post("auth/recharge", { 
            amount, 
            method: selectedOption.name, 
          });

          if (response.data.success) 
            {
            setIsCollapsed(!isCollapsed)
            setBlockchain(response.data.method);
            setWalletAddress(response.data.walletAddress);
            setQrcode(response.data.qr_code);
           }
  
        } catch (error) {
          console.error("recharge failed:", error);
          setButtonText("Recharge Failed");
          setTimeout(() => setButtonText("Deposit Now"), 3000); // Reset after 3s
          // Backend se error message properly extract karein
          const errorMessage = error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : "recharge failed. Please try again.";
      
          setError(errorMessage);
          toast.error(errorMessage); // Proper error message show karega
        }
      };

      
 

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletAddress).then(() => {
            setCopied(true);
                toast.success("Copied!");
            setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            weekday: "short", // Includes day of the week (e.g., Mon, Tue)
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false // Ensures 24-hour format
        }).replace(",", ""); // Remove comma for a cleaner format
    };

    const DropdownExample = ({ selectedOption, setSelectedOption }) => {
        const [isOpen, setIsOpen] = useState(false);
    
        const toggleDropdown = () => setIsOpen(!isOpen);
        const handleOptionClick = (option) => {
          setSelectedOption(option);
          setIsOpen(false);
        };
           
    
    
        return (
         <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between rounded-2xl border border-[#F1F1F1] bg-white text-sm w-full h-[65px] p-3 sm:p-5"
            >
              <div className="flex gap-3 font-semibold">
                <div className="flex items-center space-x-2 lg:space-x-3 text-sm">
                  <img alt={selectedOption.name} loading="lazy" width="40" height="40" src={selectedOption.logo} />
                  <span>{selectedOption.name}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
    
            {isOpen && (
              <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-2xl mt-1 z-10">
                {networkOptions.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <img alt={option.name} loading="lazy" width="25" height="25" src={option.logo} />
                    <span>{option.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };
    return (
        <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
                  
            <div>
                <div className="flex justify-between">
                    <span className="text-white text-sm rounded-[22px] h-[33px] px-3 bg-black mb-4 mt-10 flex items-center space-x-2 cursor-pointer">

                        <img alt="Back Icons" loading="lazy" width="17" height="12" src="/upnl/assets/icons/icon-back.svg" style={{ color: '#fff' }} />
                        <Link to='/Wallet'>
                            <span style={{ color: '#fff' }}>Back</span>
                        </Link>
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6">
                    <div className="lg:col-span-3 xl:col-span-2 bg-white rounded-[16px] p-6">
                        <h2 className="text-xl sm:text-2xl font-bold">Deposit</h2>
                      
                     
                        <div>
                            {/* Collapsed Div */}
                            
                            {isCollapsed && (
                            <div className="lg:col-span-3 xl:col-span-2 bg-white rounded-[16px] p-2">
                             
                                    <div className="w-full flex flex-col gap-3 md:gap-5">
                                    <div className="flex flex-col gap-2">
                                        <DropdownExample  selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                                    </div>

                                    

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Amount</label>
                                        <div className="flex gap-3 rounded-2xl  focus-visible:outline-none bg-white w-full items-center h-[65px]">
                                        <input
                                            style={{ borderRadius: '10px',padding:'14px' }}  
                                            className="w-full rounded-[10px] border bg-white p-3 sm:p-5 text-sm md:text-base" 
                                            placeholder="Enter Amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        </div>


                                       
                                    </div>
                                    </div>


                                    <div className="w-full h-[1px] bg-[#F1F1F1]"></div>
                                    <div className="flex flex-col gap-2 px-0 sm:px-5">
                                    <div className="flex justify-between items-center mt-5">
                                        <p className="text-[#63728E] font-normal text-xs">Min Deposit</p>
                                        <div className="text-[#0E1A32] font-normal text-xs">100 USDT</div>
                                    </div>
                                 
                                    </div>

                                    <div className="mt-8 w-full flex justify-end">
                                    <button style={{ backgroundColor: "rgb(86 181 215)", padding: "10px,10px", borderRadius: "50px",color:"rgb(255 255 255 / 92%)", }} 
                                        onClick={handleRecharge}
                                        className=" px-6 py-3 rounded-[30px] md:w-auto disabled:opacity-50"
                                    >
                                        {buttonText}
                                    </button>
                                    </div>
                                </div>

                                    )}



                            {/* Expanded Div */}
                            {!isCollapsed && (
                                <div className="flex items-center justify-between bg-[#F9F9F9] h-[120px] mb-2 p-[15px] rounded-[16px]  hover:bg-[#ebe8e8]">
                                    <div className="py-4 flex items-start space-x-2 lg:space-x-3 text-sm" style={{ marginLeft: '10px' }}>

                                        <div>
                                        
                                            {/* Deposit Section */}
                                            <div className="flex flex-col items-center">
                                                <div className="grid grid-cols-1 gap-4 w-full mt-5 p-6 bg-[#F9F9F9] rounded-[20px]">
                                                    <div className="col-span-3 text-center text-[#999999] text-[14px]">
                                                    <center>
                                                        Send BNB tokens to the QR code or address below.
                                                        </center>
                                                    </div>

                                                    {/* QR Code */}
                                                    <div className="col-span-2 md:col-span-1">
                                          
                                                    <center> 

                                                    <img
                                                    src={`data:image/png;base64,${qrCode}`}
                                                    alt="USDT QR Code"
                                                    style={{ maxWidth: '300px' }}
                                                />
                                                         
                                                         </center>
                                                    </div>

                                                    {/* Network & Address Section */}
                                                    
                                                    <div className="col-span-3 md:col-span-2 h-full flex flex-col justify-start gap-4">
                                                        {/* Network Information */}
                                                        <div className="bg-white p-4 w-full rounded-[20px]">
                                                            <p className="text-secondary text-[14px] font-medium pb-[7px]">Network</p>
                                                            <div className="flex items-center justify-start gap-2">
                                                                <img
                                                                    alt="BSC logo"
                                                                    loading="lazy"
                                                                    width="30"
                                                                    height="30"
                                                                    decoding="async"
                                                                    src={(blockchain=="USDT BEP20")?'/upnl/assets/icons/logo_bnb_2.svg':'/upnl/assets/icons/12114250.png'}
                                                                    style={{ color: "transparent" }}
                                                                />
                                                                {(blockchain=="USDT TRC20")?'Tron Blockchain':'Binance Smart Chain'}
                                                            </div>
                                                        </div>

                                                        {/* Wallet Address */}
                                                        <div className="bg-white p-4 w-full rounded-[20px] flex items-center justify-between">
                                                            <div
                                                                className="break-all text-secondary text-[14px] font-medium flex flex-col gap-1"
                                                                style={{ width: "calc(100% - 100px)" }}
                                                            >
                                                                <p>Your Address</p>
                                                                <p className="text-primary">
                                                                    {walletAddress}
                                                                </p>
                                                            </div>
                                                            <button type='button' className="bg-black min-w-[90px] h-[46px] rounded-[30px] text-white px-4 py-2"  onClick={copyToClipboard} style={{ color: "#fff" }}>
                                                            {copied ? "Copied!" : "Copy"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Warning Section */}
                                            <div className="flex justify-between items-center gap-4 w-full border mt-5 p-3 rounded-[20px]">
                                                <img
                                                    alt="warning logo"
                                                    loading="lazy"
                                                    width="40"
                                                    height="40"
                                                    decoding="async"
                                                    src="/upnl/assets/icons/icon_warning_2.svg"
                                                    style={{ color: "transparent" }}
                                                />
                                                <p className="text-sm text-secondary">
                                                    Important: Keep this page open until your deposit transaction is
                                                    recorded. If it's not recorded, you can use our form to{" "}
                                                    {/* <a href="#" className="text-primary">
                                                        submit it manually
                                                    </a> */}
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                       
                        </div>
                    </div>
                    <div className="bg-white rounded-[16px] p-6 lg:col-span-2 xl:col-span-1">
                        <h3 className="font-semibold mb-3">History</h3>
                        <div className="space-y-4 h-full">
                        {users.length > 0 ? (
                             users.map((user, index) => (
                            <div className="flex justify-between items-center text-sm mb-4" key={index}>
                                <div className="flex">
                                    <div className="flex items-center justify-center hover:cursor-pointer rounded-[50%] bg-[#F9F9F9] w-[44px] h-[44px]">
                                        <img alt="IN Icon" loading="lazy" width="28" height="28" src="/upnl/assets/icons/icon_down.svg" style={{ color: 'transparent' }} />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium mb-1">Deposit</p>
                                        <p className="text-secondary font-light text-xs">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    
                                    <p className={`text-${user?.status=='Decline' ? 'red' : 'green'}-500`}>{user?.status=='Decline'?'-':'+'} <span>{user.amount} USDT </span></p>
                                </div>
                            </div>
                                     ))
                                    ) : (
                                     <div className="flex h-full justify-center items-center w-full text-secondary">
                        <div className="w-full text-center">
                            <img
                                style={{ width: "60px", height: "60px" }}
                                alt="Icon Empty"
                                loading="lazy"
                                className="mx-auto mb-2"
                                src="/icons/empty_state.svg"
                            />
                            <span>No transactions found</span>
                        </div>
                    </div>
                                    )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RechargeFunds;