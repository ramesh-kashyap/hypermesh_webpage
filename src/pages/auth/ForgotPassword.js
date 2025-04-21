import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ResetPasswordModal from "./ResetPasswordModal";
import Api from "../../Requests/Api";
import toast from "react-hot-toast";
import EmailModel from "./EmailModel";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
            setMessage(response.data.message);
        } catch (error) {
            console.error("Forgot Password Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Error sending reset link");
        }
    };


   const sendLink = () => {

    if (!email) {
      toast.error("Please enter your email address");
      return false;
    }
   setIsModalOpen(true);
  };

  const handleVerify = async (code) => {
    try {
     setIsVerifying(true);
     const response = await Api.post("auth/verified-email",{code,email});
      toast.success(response.data.message); // Backend ka success message show karega
      setIsModalOpen2(true);
      setIsVerifying(false);
     } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
           ? error.response.data.error
           : "account verify failed. Please try again.";
           setIsVerifying(false);
        toast.error(errorMessage); // Proper error message show karega
     }
 
  };

  const resetPassword = async (newPass) => {
    try {
      setIsVerifying(true);
  
      const response = await Api.post("auth/resetPassword", { newPass, email });
  
      toast.success(response.data.message);
  
      setIsVerifying(false);
  
      // ✅ Wait 5 seconds then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Account verify failed. Please try again.";
      setIsVerifying(false);
      toast.error(errorMessage);
    }
  };

  const handleResend = () => {
    alert("Resending verification code...");
  };



  return (

    
    <div className="min-h-screen flex flex-col items-center justify-center pt-[100px] bg-gray-50 p-6">

          {isModalOpen && (
                     <EmailModel 
                        onClose={() => setIsModalOpen(false)} 
                        onVerify={handleVerify} 
                        onResend={handleResend} 
                        email={email}
                     />
                     )}


                  {isModalOpen2 && (
                    <ResetPasswordModal
                    onSubmit={(newPass) => {
                      console.log("Set password:", newPass);
                      resetPassword(newPass); // ✅ Call your own function
                    }}
                  />
                     )}
    
       <div className="absolute top-6 flex justify-between w-full px-6">
        <img
          alt="MeshNode Logo"
          loading="lazy" style={{ width: '182px' }}
          className="hidden sm:flex"
          src="/upnl/assets/icons/logo.png" />
        <img
          alt="Logo"
          loading="lazy" style={{ width: '67px' }}
          className="flex sm:hidden"
          src="/upnl/assets/icons/logo-2.png" />
        <div className="flex">
        <Link to="/login">
          <button className="w-[80px] md:w-[100px] mr-2 md:mr-4 py-2 px-2 md:px-4 bg-green-500 text-white rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Log In
          </button>
          </Link>
          <Link to="/register">
          <button className="w-[100px] py-2 px-2 md:px-4 bg-[#171717] text-white rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" style={{color:"#fff"}}>
            Sign Up
          </button>
          </Link>
        </div>
      </div>
      <div className="bg-white max-w-[385px] rounded-[20px] py-6 px-6 md:px-8 w-full shadow-lg">
        <h2 className="text-[28px] font-semibold text-gray-800 text-center mb-2">
        Forgot Password
        </h2>
        
        <form  > {/* Change here */}
          <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
          Email
            </label>
            <div className="relative">

            <input
              name="email"
              type="email"
              value={email} onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500"
            />
          </div>
          </div>

         
           
          <button
            type="button" onClick={sendLink} 
            className="w-full h-[46px] py-2 px-4 bg-green-500 font-medium text-white rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
          >
            Send Reset Link
          </button>
        </form>

        {/* <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account? 
            <a className="text-gray-800 underline font-semibold" href="/register">
              Sign Up
            </a>
          </span>
        </div> */}
        <p>{message}</p>

      </div>
    </div>
  );
};

export default ForgotPassword;
