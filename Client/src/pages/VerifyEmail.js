
// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// // const VerifyEmail = () => {
// //   const { token } = useParams();
// //   const [message, setMessage] = useState("Verifying...");
// //   const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const verifyEmail = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BACKEND}/auth/verify-email/${token}`
// //         );
// //         setMessage(response.data.message);
// //         setStatus("success");
// //         setTimeout(() => navigate("/login"), 3000);
// //       } catch (error) {
// //         setMessage(error.response?.data?.message || "Invalid or expired token");
// //         setStatus("error");
// //       }
// //     };

// //     verifyEmail();
// //   }, [token, navigate]);

// //   const renderIcon = () => {
// //     if (status === "verifying") {
// //       return (
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
// //       );
// //     } else if (status === "success") {
// //       return <FaCheckCircle className="text-green-500 text-6xl mb-4" />;
// //     } else {
// //       return <FaTimesCircle className="text-red-500 text-6xl mb-4" />;
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 px-4">
// //       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
// //         {renderIcon()}
// //         <h2 className={`text-xl font-semibold mb-2 ${
// //           status === "error" ? "text-red-600" : "text-green-600"
// //         }`}>
// //           {message}
// //         </h2>
// //         {status !== "verifying" && (
// //           <p className="text-gray-500">You will be redirected shortly...</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default VerifyEmail;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const [message, setMessage] = useState("Verifying...");
//   const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND}/auth/verify-email/${token}`
//         );
//         setMessage(response.data.message);
//         setStatus("success");
//         setTimeout(() => navigate("/login"), 3000);
//       } catch (error) {
//         setMessage(error.response?.data?.message || "Invalid or expired token");
//         setStatus("error");
//       }
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   const renderIcon = () => {
//     return (
//       <div className="flex justify-center">
//         {status === "verifying" ? (
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
//         ) : status === "success" ? (
//           <FaCheckCircle className="text-green-500 text-6xl mb-4" />
//         ) : (
//           <FaTimesCircle className="text-red-500 text-6xl mb-4" />
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
//         {renderIcon()}
//         <h2
//           className={`text-xl font-semibold mb-2 ${
//             status === "error" ? "text-red-600" : "text-green-600"
//           }`}
//         >
//           {message}
//         </h2>
//         {status !== "verifying" && (
//           <p className="text-gray-500">You will be redirected shortly...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const [message, setMessage] = useState("Verifying your email...");
//   const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyEmail = async () => {
//       if (!token) {
//         setMessage("No verification token provided");
//         setStatus("error");
//         return;
//       }

//       try {
//         console.log("Verifying token:", token); // Debug log
        
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND}/auth/verify-email/${token}`
//         );
        
//         console.log("Verification response:", response.data); // Debug log
        
//         setMessage(response.data.message || "Email verified successfully!");
//         setStatus("success");
        
//         // Redirect to login page after 3 seconds
//         setTimeout(() => {
//           navigate("/login", { 
//             state: { 
//               message: "Email verified successfully! You can now login." 
//             } 
//           });
//         }, 3000);
        
//       } catch (error) {
//         console.error("Verification error:", error); // Debug log
        
//         // Handle different error scenarios
//         if (error.response) {
//           // Server responded with error status
//           const errorMessage = error.response.data?.error || 
//                              error.response.data?.message || 
//                              "Verification failed";
//           setMessage(errorMessage);
//         } else if (error.request) {
//           // Request was made but no response received
//           setMessage("Network error. Please try again later.");
//         } else {
//           // Something else happened
//           setMessage("An unexpected error occurred");
//         }
        
//         setStatus("error");
//       }
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   const handleRetry = () => {
//     setStatus("verifying");
//     setMessage("Verifying your email...");
//     // Re-trigger verification
//     window.location.reload();
//   };

//   const handleBackToLogin = () => {
//     navigate("/login");
//   };

//   const renderIcon = () => {
//     return (
//       <div className="flex justify-center">
//         {status === "verifying" ? (
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
//         ) : status === "success" ? (
//           <FaCheckCircle className="text-green-500 text-6xl mb-4" />
//         ) : (
//           <FaTimesCircle className="text-red-500 text-6xl mb-4" />
//         )}
//       </div>
//     );
//   };

//   const renderButtons = () => {
//     if (status === "error") {
//       return (
//         <div className="mt-6 space-y-3">
//           <button
//             onClick={handleRetry}
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//           >
//             Try Again
//           </button>
//           <button
//             onClick={handleBackToLogin}
//             className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//           >
//             Back to Login
//           </button>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
//         {renderIcon()}
        
//         <h2 className={`text-xl font-semibold mb-4 ${
//           status === "error" ? "text-red-600" : 
//           status === "success" ? "text-green-600" : "text-blue-600"
//         }`}>
//           {status === "verifying" ? "Email Verification" : 
//            status === "success" ? "Verification Successful!" : "Verification Failed"}
//         </h2>
        
//         <p className={`text-sm mb-4 ${
//           status === "error" ? "text-red-500" : "text-gray-600"
//         }`}>
//           {message}
//         </p>
        
//         {status === "success" && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//             <p className="text-green-700 text-sm">
//               You will be redirected to the login page in a few seconds...
//             </p>
//           </div>
//         )}
        
//         {renderButtons()}
        
//         {status === "verifying" && (
//           <p className="text-gray-500 text-sm mt-4">
//             Please wait while we verify your email address...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;



import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent multiple calls (especially in React StrictMode)
      if (hasVerified.current || !token) return;
      hasVerified.current = true;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/auth/verify-email/${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();

        setIsLoading(false);

        if (response.ok) {
          setMessage(data.message || "Email verified successfully!");
          setIsSuccess(true);
          
          // Redirect after 5 seconds
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "Email verified successfully! You can now login.",
                type: "success"
              } 
            });
          }, 5000);
        } else {
          // Handle server errors
          setMessage(data.error || data.message || "Verification failed.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setIsLoading(false);
        setMessage("Network error. Please check your connection and try again.");
        setIsSuccess(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleRetryVerification = () => {
    hasVerified.current = false;
    setIsLoading(true);
    setMessage("Verifying your email...");
    // This will trigger useEffect again
    window.location.reload();
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
      );
    }
    return isSuccess ? (
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
    ) : (
      <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {renderIcon()}
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Email Verification
        </h2>
        
        <p className={`text-lg mb-6 font-medium ${
          isSuccess ? "text-green-600" : 
          isLoading ? "text-blue-600" : "text-red-600"
        }`}>
          {message}
        </p>
        
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">
              🎉 Great! Your email has been verified successfully.
            </p>
            <p className="text-green-600 text-sm mt-2">
              Redirecting to login page in 5 seconds...
            </p>
          </div>
        )}
        
        {!isLoading && !isSuccess && (
          <div className="space-y-3">
            <button
              onClick={handleRetryVerification}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Login
            </button>
            <p className="text-gray-500 text-sm mt-4">
              If the problem persists, please contact support.
            </p>
          </div>
        )}
        
        {isLoading && (
          <p className="text-gray-500 text-sm">
            Please wait while we verify your email address...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;