import { useEffect, useState } from "react";
import Api from "../../Requests/Api";
import LiveTimeAgo from "./CountdownTimer";

const Node = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balanceArray, setBalance] = useState([]);
  const [lastTrade, setlastTrade] = useState(null);
  

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Api.get("auth/telegram-history");
        if (response.data.success) {
          setUsers(Array.isArray(response.data.data) ? response.data.data : []);
          setlastTrade(response.data.lastTrade);
          
        } else {
          setError("Failed to load nodes");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchbalance();
  }, []);


  const fetchbalance = async () => {
    try {
       const response = await Api.get('auth/available-balance');
       setBalance(response.data);
    } catch (err) {
       setError(err.response?.data?.error || "Error fetching income");
    }
 };


  // Helper function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
  
    const target = new Date(dateString);
    const now = new Date();
    const diffMs = target - now; // Future time - current time
  
    if (diffMs <= 0) {
      return "Time's up!";
    }
  
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
  
    return parts.join(" ");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

 

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-10 xl:px-20 pt-5 pb-[88px] md:pb-[20px] bg-[#F1F1F1]">
      <div className="w-full flex justify-center text-primary">
        <div className="w-full max-w-[1440px] rounded-lg">
          {/* Header with action button */}
          <div className="flex justify-between mb-4 items-center">
            <button
              className="px-3 flex items-center h-[34px] rounded-[22px] text-[14px] text-white"
              style={{ background: "#54bbd3" }}
            >
              New Node
            </button>
          </div>

          {/* Table Header */}
          <div className="bg-white mb-3 p-4 rounded-[16px] font-semibold text-gray-600 text-center">
            <div className="hidden md:grid grid-cols-5 lg:grid-cols-6">
              <div className="text-left">Node</div>
              <div className="hidden lg:inline-block">Unique ID</div>
              <div>Status</div>
              <div>Total Uptime</div>
              <div className="text-right">Today Rewards</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden">
              <div className="text-left">Node</div>
              <div className="text-right">Rewards</div>
           
            </div>
          </div>

          {/* Render User Nodes */}
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.telegram_id || user.id}
                className="bg-white p-3 rounded-[16px] shadow transition-transform hover:shadow-md cursor-pointer mb-4"
              >
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-5 lg:grid-cols-6 items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    <img alt="Node Icon" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" src="/icons/node-icon-telegram.svg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.tname}</p>
                      <p className="text-xs text-[#999999]">Telegram Node</p>
                    </div>
                  </div>
                  <p className="hidden lg:block text-sm text-center font-medium">
                    {user.telegram_id}
                  </p>
                  <div className="flex justify-center">
                    <div className="flex px-[6px] py-1 rounded-full text-xs bg-[#FFC2BF]" style={{background:'rgb(196 255 200/var(--tw-bg-opacity))'}}>
                    <img alt="Status Icon" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="mr-1" src="/icons/check-circle.svg" style={{color:'transparent'}} />Online
                    </div>
                    
                  </div>
                  <div className="flex justify-center">
                    <p className="text-sm w-fit text-center px-3 bg-[#F1F1F1] rounded-full">
                    <LiveTimeAgo dateString={lastTrade} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      <span>{isNaN(balanceArray.todayReward) ? "0.00" : Number(balanceArray.todayReward).toFixed(3)}</span>
                    </p>
                    <p className="text-xs">
                      Total : <span>{isNaN(balanceArray.totalReward) ? "0.00" : Number(balanceArray.totalReward).toFixed(2)} USDT</span>
                    </p>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    <img alt="Node Icon" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" src="/icons/node-icon-telegram.svg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.telegram_id}</p>
                      <p className="text-xs text-[#999999]">Telegram Node</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {user.balance.toFixed(1)} USDT
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-semibold">
                      <span>0pt</span>
                    </p>
                    <p className="text-xs">
                      Total: <span>0pt</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No nodes found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Node;