import { useEffect, useState } from "react";
import moment from "moment";

import axios from "axios";
import Api from "../../Requests/Api";

const Wallet = () => {
    // const [isPopupVisible, setPopupVisible] = useState(false);

    const [users, setUsers] = useState([]); // ✅ Always start with an empty array
    const [balanceArray, setBalance] = useState([]); // ✅ Always start with an empty array
    const [transaction, setTransaction] = useState([]); // ✅ Always start with an empty array
    const [liveRates, setLiverates] = useState([]); // ✅ Always start with an empty array
    const [error, setError] = useState("");
    const [pop, setPop] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const recordsPerPage = 10;



    const handleClose = () => {
        setPop(!pop); // Button click par pop false hoga
    };



    useEffect(() => {
        fetchbalance();
        fetchUsers();
        fetchliveRates();
    }, []);


    useEffect(() => {
        getTransactions(currentPage);
    }, [currentPage]); // Dependency on `currentPage`

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

    const fetchliveRates = async () => {
        try {
            const response = await Api.get("auth/liveRates");

            if (response.data.success) {
                setLiverates(response.data.responseData);
            }

        } catch (err) {
            setError(err.response?.data?.error || "Error fetching income");
        }
    };


    const getTransactions = async (page) => {
        try {
            const response = await Api.get(`auth/getTransactions?page=${page}&limit=${recordsPerPage}`);
            if (response.data.success) {
                setTransaction(response.data.transactions);
                setTotalPages(response.data.totalPages);
            }


        } catch (err) {
            setError(err.response?.data?.error || "Error fetching income");
        }
    };
    const fetchbalance = async () => {
        try {
            const response = await Api.get('auth/available-balance');
            setBalance(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching income");
        }
    };

    //  const handleLinkClick = (event) => {
    //     event.preventDefault(); // Prevent any default link behavior
    //     // Ensure the popup does not open by not changing isPopupVisible
    //     console.log('Link clicked - popup remains hidden.');
    //   };


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

    // Example usage:
    // console.log(formatDate("2024-12-18T17:23:57")); 




    return (
        <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
            <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6">
                <div className="lg:col-span-3 xl:col-span-2 flex flex-col">
                    <div class="bg-white rounded-[16px] p-6 lg:p-8">
                        <div class="flex justify-between items-center mb-8">
                            <h2 class="text-[24px] font-semibold text-primary">Wallet</h2>
                            <button onClick={handleClose} class="flex items-center gap-2 px-3 py-2 bg-[#F1F1F1] rounded-[32px]">

                                <img alt="Gift Code" loading="lazy" width="22" height="22" decoding="async" data-nimg="1" src="/assets/gift-code.svg" style={{ color: 'transparent' }} />
                                <span class="text-sm font-medium text-[#171717] " style={{ fontFamily: 'Poppins' }}>Gift Code</span>
                            </button>
                        </div><div class="flex flex-col xl:flex-row gap-3 justify-between">
                            <div><p class="text-primary font-medium mb-2">Total Assets</p>
                                <p class="text-[30px] font-bold"><span>{isNaN(balanceArray.available_balance) ? "0.00" : Number(balanceArray.available_balance).toFixed(2)} USDT</span></p>
                                <p class="text-secondary"><span>deposits : $ {isNaN(balanceArray.totlinvest) ? "0.00" : Number(balanceArray.totlinvest).toFixed(2)}</span></p>
                            </div><div class="flex flex-row flex-wrap gap-3 items-end">
                                <a class="bg-black text-white h-[46px] px-6 py-2 rounded-[30px] flex flex-1 items-center justify-center" href="/RechargeFunds" style={{ color: 'white' }}>Deposit</a>
                                <a class="border border-black h-[46px] text-black px-6 py-2 rounded-[30px] flex flex-1 items-center justify-center" href="/withdraw" >
                                    <img alt="Withdraw" loading="lazy" width="22" height="22" decoding="async" data-nimg="1" src="/assets/withdraw.svg" style={{ color: 'transparent', width: '50px;' }} />
                                </a>

                            </div></div></div>


                    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${pop ? "block" : "hidden"}`}>
                        <div class="bg-white rounded-[20px] w-[413px] max-w-[95%] sm:max-w-[90%] pt-5 pb-6 px-4 sm:px-8" style={{ boxShadow: 'rgba(23, 23, 23, 0.25) 0px 4px 88.3px 0px' }}
                        >
                            <div class="flex items-center flex-col gap-5">
                                <img alt="Gift" loading="lazy" width="149" height="149" decoding="async" data-nimg="1" src="/assets/gift.svg" style={{ color: 'transparent', width: '150px' }} />
                                <div class="w-full flex flex-col items-center gap-2 text-center">
                                    <p class="text-[20px] leading-[30px] font-bold text-primary" style={{ fontFamily: 'Poppins' }}>Claim Gift Code</p>
                                    <p class="text-sm text-secondary" style={{ fontFamily: 'Poppins' }}>Enter your gift code below to redeem your reward</p></div>
                                <div class="flex flex-col gap-2 w-full">
                                    <input type="text" placeholder="Enter gift code" class="w-full px-4 py-3 text-sm border border-gray-300 rounded-[12px] focus-visible:outline-none placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50" style={{ marginLeft: '3px' }} value="" />
                                    <div id="cf-turnstile" class="text-center mt-3"><div>
                                        <input type="hidden" name="cf-turnstile-response" id="cf-chl-widget-ycpto_response" value="" />
                                    </div></div></div></div><div class="flex justify-center mt-6"><button onClick={handleClose} class="px-4 py-2 mr-2 font-medium h-[46px] rounded-[30px] bg-[#F1F1F1] text-black w-[120px]">Cancel</button>
                                <button class="px-4 py-2 w-[120px] h-[46px] font-medium rounded-[30px] bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: 'white' }} >Claim Now</button></div></div></div>


                    <div className="bg-white rounded-[16px] mt-6 p-6 lg:p-8 flex-1">
                        <h3 className="font-semibold mb-3">Assets</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="text-secondary">
                                    <th className="text-left py-1 font-medium text-[12px]">Asset</th>
                                    <th className="text-right py-1 font-medium text-[12px]">Holdings</th>
                                    <th className="text-right py-1 font-medium text-[12px] hidden md:table-cell">Price</th>
                                    <th className="text-right py-1 font-medium text-[12px]"><span className="hidden md:inline-block">Total USD</span><span className="md:hidden">USD</span></th>
                                </tr>
                            </thead>
                            <tbody>

                                {liveRates.length && liveRates.map((asset, index) => (
                                    <tr className="border-t h-[72px]" key={index}>
                                        <td className="py-4 flex items-center space-x-2 lg:space-x-3 text-sm">
                                            <img alt={`${asset.name} logo`} loading="lazy" width="40" height="40" src={`upnl/assets/icons/${asset.logo}`} style={{ color: 'transparent' }} />
                                            <span>{asset.name}</span>
                                        </td>
                                        <td className="py-4 text-right text-sm"><span>{asset.holdings}</span></td>
                                        <td className="py-4 text-primary text-right text-sm hidden md:table-cell"><span className="text-secondary">{asset.price}</span></td>
                                        <td className="py-4 text-primary text-right text-sm">
                                            <div className="flex flex-col md:flex-row justify-end gap-1">
                                                <p><span>{asset.total}</span></p>
                                                <p className="block md:hidden text-secondary text-sm"><span>Price: {asset.price}</span></p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white rounded-[16px] p-6 lg:col-span-2 xl:col-span-1">
                    <h3 className="font-semibold mb-3">History</h3>
                    <div className="space-y-4 h-full">
                        {transaction.length > 0 ? (
                            transaction.map((user, index) => {
                                const isCredit = user.credit_type === 1; // If credit_type is 1, it's a credit (+)
                                const formattedTime = moment(user.created_at).fromNow(); // Format time like "an hour ago", "21 hours ago"
                                return (
                                    <div className="flex justify-between items-center text-sm mb-4" key={index}>
                                        <div className="flex">
                                            <div className="flex items-center justify-center hover:cursor-pointer rounded-[50%] bg-[#F9F9F9] w-[44px] h-[44px]">
                                                <img
                                                    alt="Transaction Icon"
                                                    loading="lazy"
                                                    width="28"
                                                    height="28"
                                                    src={isCredit ? "/icons/icon_down.svg" : "/icons/icon_up.svg"}
                                                    style={{ color: 'transparent' }}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium mb-1">{user.remarks || "Transaction"}</p>
                                                <p className="text-secondary font-light text-xs">{formattedTime}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={isCredit ? "text-green-500" : "text-red-500"}>
                                                {isCredit ? "+" : "-"}<span>{user.amount}</span> USDT
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No users found</p>
                        )}

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

                    </div>
                </div>
            </div>


        </div>
    );
};

export default Wallet;