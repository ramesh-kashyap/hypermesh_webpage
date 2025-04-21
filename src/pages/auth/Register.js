import React, { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Api from "../../Requests/Api";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Register = () => {

  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  const initialState = {
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    verificationCode:"",
    referralCode: refCode?refCode:''
};

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Track success state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Hide success message before new submission
    const { fullName, email, password, repeatPassword, referralCode , verificationCode } = formData;

    // Basic validation
    if (!fullName || !email || !password || !repeatPassword || !verificationCode || !referralCode) {
      toast.error("⚠️ All fields are required!");
      setLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      toast.error("⚠️ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post('auth/register', { fullName, email, password, repeatPassword, referralCode,verificationCode });
      if (response.data.status) {
          // Reset form after successful registration
          setFormData(initialState);
          setSuccess(true); // Show success message
          // toast.success("✅ Registration successful!");
      }
      else {
        toast.error(response.data.message || "Login failed");
      }


    } catch (error) {
      toast.error(`❌ ${error.message || "Registration failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (loading || countdown > 0) return;
  
    if (!formData.email) {
      toast.error("Please enter your email first!");
      return;
    }
  
    // setLoading(true);
    startCountdown(60);
  
    try {
      const response = await Api.get("auth/sendCodeSignUp", {
        params: { email: formData.email }
      });
  
      if (response.data.success) {
        setCodeSent(true);
        toast.success("OTP sent successfully to your email!");
      } else {
        setCodeSent(false);
        toast.error("Failed to send OTP. Try again.");
      }
    } catch (error) {
      setCodeSent(false);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      // setLoading(false);
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
   <><Toaster position="top-center" /><div className="min-h-screen flex flex-col items-center justify-center pt-[100px] bg-gray-50 p-6" style={{minHeight:'146vh'}}>
      <div  className={`register-success fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ${success ? "show" : ""}`}  style={{backgroundColor:'rgb(0 0 0/var(--tw-bg-opacity))',backgroundImage:'none'  }} >
        <div class="bg-[#FFF] rounded-[20px] px-8 pt-10 pb-6 w-[400px] max-w-[90%] text-center">
          <img alt="Success" loading="lazy" width="80" height="80" decoding="async" data-nimg="1" class="mx-auto" src="/upnl/assets/icons/icon_success.svg" style={{ width: "80px" }} />
          <p class="text-[24px] font-semibold text-primary mt-8 mb-2">Your account has been successfully created!</p>
          <p class="text-secondary text-sm">Start mining tokens and earning rewards right away</p>
          <Link to="/login">
          <button class="w-full mt-10 bg-[#171717] text-white h-[46px] py-2 rounded-[30px]" style={{ color: "#fff" }}>Log in</button>
          </Link>
        </div>
      </div>
      <div className="absolute top-6 flex justify-between w-full px-6">
      <a href="https://hypermesh.io/">
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
          </a>
        <div className="flex">
          <Link to="/login">
            <button className="w-[80px] md:w-[100px] mr-2 md:mr-4 py-2 px-2 md:px-4 bg-green-500 text-white rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              Log In
            </button>
          </Link>
          <Link to="/register">
            <button className="w-[100px] py-2 px-2 md:px-4 bg-[#171717] text-white rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" style={{ color: "#fff" }}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      <div
        className="bg-white rounded-[20px] py-6 px-6 md:px-8 w-full max-w-[500px]"
        style={{ boxShadow: "rgba(23, 23, 23, 0.25) 0px 4px 88.3px 0px" }}
      >
        <h2 className="text-[28px] font-semibold text-gray-800 text-center mb-2">
          Sign Up
        </h2>
        <p class="text-sm text-[#999] text-center mb-9">Join HyperMesh to earn rewards and power the future of decentralized AI!</p>
        <form onSubmit={handleSubmit} class="space-y-5">
          <div>
            <label className="block text-sm mb-[4px] font-medium text-gray-700">Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 h-[48px] block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500" />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 h-[48px] block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500" />
          </div>

          
          <div>
        <label className="block text-sm font-medium text-gray-700">Verification Code</label>
        <div className="mt-1 flex rounded-[12px] shadow-sm border border-gray-300 overflow-hidden">
          <input
            type="text"
            name="verificationCode"
            placeholder="Enter Code"
            value={formData.verificationCode || ""}
            onChange={handleChange}
            className="h-[48px] w-full px-4 py-2 focus:outline-none focus:ring focus:ring-green-500"
          />
          <button
            type="button"
            className="send-code-btn"
            onClick={handleSendCode}  // Replace with actual send logic
          >
            {countdown > 0 ? `Wait ${countdown}s` : "Send Code"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
          <div className="w-full md:w-1/2 relative">
            <label htmlFor="password" className="block mb-[4px] text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 h-[48px] block w-full px-4 py-2 pr-10 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            <div style={{top: '41px;'}}
              className="absolute inset-y-7 right-3 flex items-center cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-2 md:mt-0 relative">
            <label htmlFor="repeatPassword" className="block mb-[4px] text-sm font-medium text-gray-700">
              Repeat Password
            </label>
            <input
              type={showRepeatPassword ? "text" : "password"}
              name="repeatPassword"
              placeholder="Repeat Password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="mt-1 h-[48px] block w-full px-4 py-2 pr-10 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500"
            />
            <div
              className="absolute inset-y-7 right-3 flex items-center cursor-pointer" style={{top: '41px;'}}
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              {showRepeatPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Referral Code</label>
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code "
              value={formData.referralCode}
              onChange={handleChange}
              className="mt-1 h-[48px] block w-full px-4 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring focus:ring-green-500" />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" required
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-green-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Read and Accept our <a href="https://hypermesh.io/disclaimer.html" target="_blank" className="text-green-700 font-medium">Terms & Conditions</a>
            </label>
          </div>


          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-[30px] shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div class="mt-6 text-center"><span class="text-sm text-gray-600">Already have an account? <a class="text-gray-800 underline text-[14px] font-semibold decoration-solid" href="/login">Log In</a></span></div>
      </div>
    </div></>
  );
};

export default Register;
