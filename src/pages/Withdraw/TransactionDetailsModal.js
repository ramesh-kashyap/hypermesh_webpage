import React, { useState, useEffect } from "react";
import Api from "../../Requests/Api";
const TransactionDetailsModal = ({ transactionId, onClose }) => {
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
      if (transactionId) {
        fetchTransaction();
      }
    }, [transactionId]);
  
    const fetchTransaction = async () => {
        const response = await Api.get("auth/getWithdrawInfo", {
            params: { withdrawId: transactionId },
          });      
          setTransaction(response.data.withdrawInfo);
    };
      
    if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white relative rounded-[20px] w-[550px] px-3 py-3 md:px-10 md:py-10 max-w-[90%] flex flex-col gap-3">
        
        {/* Title */}
        <div className="flex justify-between text-center items-center">
          <h2 className="text-xl w-full font-bold">Transaction Details</h2>
        </div>

        {/* Amount */}
        <div
          className="text-2xl md:text-4xl my-0 md:my-2 w-full text-center font-semibold text-[#00C076]"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          - <span>{transaction.amount} USDT</span>
        </div>

        {/* Transaction Information */}
        <div className="flex flex-col gap-3 w-full">
          
          {/* Network & Address */}
          <div className="flex flex-col gap-2 md:gap-3 border border-[#F1F1F1] bg-[#F9F9F9] p-3 rounded-xl">
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">Network</p>
              <p className="text-[#0E1A32] font-medium text-sm max-w-full overflow-hidden truncate">
                {transaction.payment_mode}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">To Address</p>
              <p className="text-[#0E1A32] font-medium text-sm max-w-full break-words">
                {transaction.account}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">Transaction Hash</p>
              <p className="text-[#0E1A32] font-medium text-sm max-w-full break-words">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://bscscan.com/tx/${transaction.txn_id}`}
                  className="text-blue-500 underline"
                >
                  {transaction.txn_id}
                </a>
              </p>
            </div>
          </div>

          {/* Fee & Status */}
          <div className="flex flex-col gap-2 md:gap-3 border border-[#F1F1F1] bg-[#F9F9F9] p-3 rounded-xl">
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">Transaction Fee</p>
              <p className="flex text-[#0E1A32] font-medium text-sm">
                <span>{transaction.charge} USDT</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">Received Amount</p>
              <p className="text-[#0E1A32] font-medium text-sm">
                <span>{transaction.payable_amt} USDT</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#63728E] font-normal text-xs">Status</p>
              <p className="text-[#0E1A32] font-medium text-sm"> {transaction.status === "Pending"
                ? "Processing"
                : transaction.status === "Approved"
                ? "Completed"
                : "Failed"}</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose} style={{color:'#fff'}}
            className="w-full px-4 py-2 rounded-[30px] h-[46px] bg-[#171717] text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;