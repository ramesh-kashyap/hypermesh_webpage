import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import api from "../../Requests/Api";
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import TransactionDetailsModal from "./TransactionDetailsModal";

const networkOptions = [
  {
    name: "USDT TRC20",
    logo: "upnl/assets/icons/tron-logo.png",
  },
  {
    name: "USDT BEP20",
    logo: "upnl/assets/icons/bnb-logo.png",
  },
];

const WithdrawComponent = () => {
  const [selectedOption, setSelectedOption] = useState(networkOptions[0]);
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailChangeDate, setChangedDate] = useState(null);
  const [adate, setAdate] = useState(null);
  const [buttonText, setButtonText] = useState("Confirm");
  const [address, setAddress] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [balance, setBalance] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isConfirm, setIsConfirm] = useState(false);
  const [unlockTime, setUnlockTime] = useState(null);
  const [pop, setPop] = useState(false);
  const [popConfirm, setConfirmpop] = useState(false);
  const [popSuccess, setSuccesspop] = useState(false);
  const [unlockHours, setUnlockHours] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);


  const openModal = (id) => setSelectedTransactionId(id);
  const closeModal = () => setSelectedTransactionId(null);

  useEffect(() => {
    fetchbalance();
    fetchUserAddress();

  }, []);



  const fetchbalance = async () => {
    try {
      const response = await api.get('auth/available-balance');
      setBalance(response.data);
      
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching income");
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await api.get("auth/usdt-address");
      if (response.data.status) {
        const changedDate = response.data.detail_changed_date;
        const addressDate = response.data.adate;
        setChangedDate(changedDate);
        setAdate(addressDate);

        // Now process unlockTime calculation
        if (addressDate) {
          let baseDate = new Date(addressDate);
          let unlockDate = new Date(baseDate);
          unlockDate.setHours(unlockDate.getHours() + 96); // Add 96 hours (4 days)

          if (changedDate) {
            let changedDateObj = new Date(changedDate);
            if (changedDateObj > unlockDate) {
              unlockDate = new Date(changedDateObj);
              unlockDate.setHours(unlockDate.getHours() + 48); // Add 48 hours (2 days)
            }
          }

          const now = new Date();
          const remainingTime = unlockDate - now;
          const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60)); // Convert milliseconds to hours
          setUnlockTime(unlockDate);
          setUnlockHours(remainingHours);
          setIsDisabled(now < unlockDate);
        }
        setAddress(selectedOption.name == "USDT BEP20" ? response.data.usdtBep20 : response.data.usdtTrc20);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, [selectedOption.name]);

  useEffect(() => {
    const fetchWithdraws = async (page) => {
      try {
        const response = await api.get(`auth/withdraws?page=${page}&limit=${recordsPerPage}`);
        setWithdraws(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch withdraw history");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdraws(currentPage);
  }, [currentPage]); // Depend on page change


  const handleClose = () => {
    setPop(!pop); // Button click par pop false hoga
  };

  const handleCloseSuccess = () => {
    setSuccesspop(!popSuccess); // Button click par pop false hoga
  };

  useEffect(() => {
    if (isConfirm) {
      handleWithdraw();
    }
  }, [isConfirm]); // Run handleWithdraw when isConfirm becomes true


  const handleWithdrawClick = () => {
    setIsConfirm(true);
    setButtonText("Processing...");
  };

  const handleWithdraw = async () => {
    if (!amount || !selectedOption?.name || !address || !code) {
      toast.error("All fields are required."); // Show error message
      return;
    }

    if (amount<30) {
      toast.error("You must withdraw at least 30 USDT"); // Show error message
      return;
    }

    if (isDisabled) {
      setPop(true); // Set pop-up variable to true
      return;
    }

    const todayReward = balance.todayReward;

    if (todayReward>0) {
      toast.error("Withdrawals are not allowed while Node Power is active"); // Show error message
      return;
    }

    console.log(todayReward);
    


    try {

      console.log("isCofrim" + isConfirm);

      if (isConfirm) {
        setConfirmpop(false);
        const response = await api.post("auth/withdrawal", {
          amount,
          method: selectedOption.name,
          address,
          code
        });
        toast.success(response.data.message); // Backend ka success message show karega
        setAmount(0);
        setCode(0);
        setCountdown(0);
        setSuccesspop(true);
        // Reload page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      else {
        setConfirmpop(true);
      }


    } catch (error) {
      console.error("Withdraw failed:", error);
      setIsConfirm(false);
      setButtonText("Withdraw Failed");
      setTimeout(() => setButtonText("Confirm"), 3000); // Reset after 3s
      // Backend se error message properly extract karein
      const errorMessage = error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : "Withdraw failed. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage); // Proper error message show karega
    }
  };

  const sendCode = async () => {
    if (loading || countdown > 0) return; // Prevent multiple clicks
    setLoading(true);
    startCountdown(60); // Start 60-second countdown
    try {
      const response = await api.get("auth/sendCode");
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


  const handleConfirmClose = () => {
    setConfirmpop(!popConfirm); // Button click par pop false hoga
    setButtonText("Confirm");
  };



  const DropdownExample = ({ selectedOption, setSelectedOption }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
      setSelectedOption(option);
      setIsOpen(false);
    };





    if (loading) return <p>Loading...</p>;
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
    <><Toaster position="top-center" /><div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
      <div>
        <div className="flex justify-between">
          <span onClick={() => window.history.back()} style={{ color: "#fff" }} className="text-white text-sm rounded-[22px] h-[33px] px-3 bg-black mb-4 mt-10 flex items-center space-x-2 cursor-pointer">
            <img alt="Back Icons" loading="lazy" width="17" height="12" decoding="async" data-nimg="1" src="upnl/assets/icons/icon-back.svg" />
            <span>Back</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-3 xl:col-span-2 bg-white rounded-[16px] p-6">
            <h2 className="text-xl sm:text-2xl font-bold">Withdraw </h2>


            <div className="w-full flex flex-col gap-3 md:gap-5">
              <div className="flex flex-col gap-2">
                <DropdownExample selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Address</label>
                <div className="flex gap-3 rounded-2xl  bg-white w-full items-center h-[65px]">
                  <input
                    style={{ borderRadius: '10px' }}
                    className="w-full rounded-2xl border bg-white p-3 sm:p-5 text-sm md:text-base"
                    placeholder="Enter The Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Amount</label>
                <div className="flex gap-3 rounded-2xl  focus-visible:outline-none bg-white w-full items-center h-[65px]">
                  <input
                    style={{ borderRadius: '10px' }}
                    className="w-full rounded-[10px] border bg-white p-3 sm:p-5 text-sm md:text-base"
                    placeholder="Minimum withdrawal 30 USDT"
                    type="number" min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="text-[#0E1A32] font-normal text-xs text-right ">
                  <span style={{ color: '#63728E' }}>Available</span> {balance.available_balance} USDT
                </div>

              </div>

              <div class="w-full">
                <div class="w-full flex flex-col gap-2">
                  <label class="text-sm font-medium">Verification Code                </label>
                  <div class="flex gap-3 rounded-2xl border border-[#F1F1F1] bg-white ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 w-full items-center h-[65px] p-3 sm:p-5">
                    <input class="w-full placeholder:text-muted-foreground placeholder:text-[#999999] text-sm md:text-base focus-visible:outline-none placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50" placeholder="Verification Code" type="text" value={code}
                      onChange={(e) => setCode(e.target.value)} />
                    <div
                      className={`text-[#00C076] font-semibold cursor-pointer get-code ${countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={sendCode}
                    >
                      {countdown > 0 ? `Wait ${countdown}s` : "Get Code"}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="w-full h-[1px] bg-[#F1F1F1]"></div>
            <div className="flex justify-between items-center mt-5">
              <div className="text-[#0E1A32] font-normal text-xs" style={{ fontSize: '10px' }}> <span style={{ color: 'red' }}>Notes:</span> Withdrawals will be disabled for 48 hours after a password reset & changing the wallet address.</div>

            </div>
            <div className="flex flex-col gap-2 px-0 sm:px-5">
              <div className="flex justify-between items-center mt-5">
                <p className="text-[#63728E] font-normal text-xs">Withdraw Fee</p>
                <div className="text-[#0E1A32] font-normal text-xs">5%</div>
              </div>
              <div className="flex justify-between items-center h-6">
                <p className="text-[#63728E] font-normal text-xs">Received Amount</p>
                <div className="text-[#0E1A32] font-semibold text-base">{amount - amount * 5 / 100} USDT</div>
              </div>


            </div>

            <div className="mt-8 w-full flex justify-end">
              <button
                style={{
                  backgroundColor: "rgb(86 181 215)",
                  padding: "10px,10px",
                  borderRadius: "50px",
                  color: "rgb(255 255 255 / 92%)",
                }}
                onClick={handleWithdraw}
                className="px-6 py-3 rounded-[30px] md:w-auto disabled:opacity-50"
              >
                Confirm
              </button>
            </div>


            {popSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white relative rounded-[20px] w-[480px] px-5 md:px-10 pt-12 pb-6 max-w-[90%]">
                <div className="flex flex-col justify-center items-center mb-8 gap-8">
                  <h2
                    className="text-2xl md:text-4xl w-full text-center font-semibold text-[#00C076]"
                    style={{ fontFamily: "ClashDisplay-Semibold" }}
                  >
                    Withdrawal Successfully
                  </h2>
                  <img
                    data-v-29a06c8f="" style={{
                      width: '234px',
                      margin: '0px auto'
                    }} src="/assets/icon_13.bf296378.png"
                    alt="" class="tw-mx-auto tw-w-140px" />
                  <div className="flex flex-col gap-3 w-full">


                    <p class="note">	Your withdrawal will be Credit within 24 to 72 hours..</p>
                  </div>
                </div>

                <div className="flex gap-3">

                  <button onClick={handleCloseSuccess}
                    className="w-full px-4 py-2 rounded-[30px] h-[46px] bg-[#171717] text-white hover:bg-gray-800" style={{ color: '#fff' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
              )}


            {popConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white relative rounded-[20px] w-[480px] px-5 md:px-10 pt-12 pb-6 max-w-[90%]">
                  <div className="flex flex-col justify-center items-center mb-8 gap-8">
                    <h2
                      className="text-2xl md:text-4xl w-full text-center font-semibold text-[#00C076]"
                      style={{ fontFamily: "ClashDisplay-Semibold", color: 'red' }}
                    >
                      - <span>{amount} USDT</span>
                    </h2>

                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex flex-col gap-3 border border-[#F1F1F1] bg-[#F9F9F9] p-3 rounded-xl">
                        <div className="flex flex-col gap-1">
                          <p className="text-[#63728E] font-normal text-xs">Network</p>
                          <p className="text-[#0E1A32] font-medium text-sm max-w-full overflow-hidden truncate">
                            {selectedOption.name}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-[#63728E] font-normal text-xs">To Address</p>
                          <p className="text-[#0E1A32] font-medium text-sm max-w-full break-words">
                            {address}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-[#63728E] font-normal text-xs">Transaction Fee</p>
                          <p className="flex text-[#0E1A32] font-medium text-sm">
                            <span>{amount * 5 / 100} USDT</span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-[#63728E] font-normal text-xs">Received Amount</p>
                          <p className="text-[#0E1A32] font-bold text-sm">
                            <span>{amount - amount * 5 / 100} USDT</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="w-full h-[46px] px-4 py-2 rounded-[30px] bg-gray-300"
                      onClick={handleConfirmClose}
                    >
                      Cancel
                    </button>
                    <button onClick={handleWithdrawClick}
                      className="w-full px-4 py-2 rounded-[30px] h-[46px] bg-[#171717] text-white hover:bg-gray-800" style={{ color: '#fff' }}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              </div>
            )}



          </div>



          {/* model popup */}

          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${pop ? "block" : "hidden"
              }`}
          >
            <div
              className="bg-white rounded-[20px] w-[413px] max-w-[95%] sm:max-w-[90%] pt-5 pb-6 px-4 sm:px-8"
              style={{ boxShadow: "rgba(23, 23, 23, 0.25) 0px 4px 88.3px 0px" }}
            >
              <div className="flex items-center flex-col gap-5">
                {/* Gift Image */}
                <img
                  alt="Gift"
                  loading="lazy"
                  width="149"
                  height="149"
                  decoding="async"
                  src="/icons/icons8-warning-48.png"
                  style={{ color: "transparent", width: "150px" }}
                />

                {/* Text Content */}
                <div className="w-full flex flex-col items-center gap-2 text-center">
                  <p
                    className="text-[20px] leading-[30px] font-bold text-primary"
                    style={{ fontFamily: "Poppins" }}
                  >
                    withdrawal can be made
                  </p>
                  <p
                    className="text-sm text-secondary"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Please note that your first withdrawal can<br></br>be made only after {unlockHours} hours at {unlockTime?.toLocaleString()}.

                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-center mt-6">
                <button onClick={handleClose}
                  className="px-4 py-2 mr-2 font-medium h-[46px] rounded-[30px] bg-[#F1F1F1] text-black w-[120px]"
                >
                  Close
                </button>

              </div>
            </div>
          </div>


          {/* History section */}
          <div className="bg-white rounded-[16px] p-6 lg:col-span-2 xl:col-span-1">
            <h3 className="font-semibold mb-3">History</h3>
            <div className="space-y-4 h-full">
              {withdraws.length > 0 ? (
                <>
                  {withdraws.map((withdrawal, index) => {
                    const formattedTime = moment(withdrawal.created_at).fromNow(); // Format time dynamically

                    return (
                      <div key={index} className="flex justify-between items-center text-sm mb-4">
                        {/* Left Section */}
                        <div className="flex">
                          <div className="flex items-center justify-center hover:cursor-pointer rounded-full bg-[#F9F9F9] w-[44px] h-[44px]">
                            <img
                              alt="OUT Icon"
                              loading="lazy"
                              width="28"
                              height="28"
                              decoding="async"
                              src="/icons/icon_up.svg"
                              style={{ color: "transparent" }}
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium mb-1">Withdraw</p>
                            <div className="flex gap-1">
                              <p className="text-secondary font-light text-xs truncate">{formattedTime}</p>
                              <p className="text-secondary font-light text-xs">•</p>
                              <button className="text-[#00C076] font-light text-xs" onClick={() => openModal(withdrawal.id)}  >Details</button>
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="text-right">
                          <p className="text-red-500">-<span>{withdrawal.amount} USDT</span></p>
                        </div>
                      </div>
                    );
                  })}




                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      <button
                        className={`px-3 py-2 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                      <button
                        className={`px-3 py-2 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}


                </>
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
            {selectedTransactionId && <TransactionDetailsModal transactionId={selectedTransactionId} onClose={closeModal} />}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default WithdrawComponent;