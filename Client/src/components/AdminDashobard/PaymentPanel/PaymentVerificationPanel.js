//(Copy of Frontend Code for Payment Verification Panel June 17,2025)
// import React, { useState } from "react";
// import { Check, X, Eye, Pencil, ArrowLeft } from "lucide-react";

// // Centralized subscription plans
// const subscriptionPlans = [
//   { id: "weekly", name: "Weekly Plan", price: "PKR 350", duration: "1 Week" },
//   {
//     id: "monthly",
//     name: "Monthly Plan",
//     price: "PKR 999",
//     duration: "1 Month",
//   },
//   {
//     id: "yearly",
//     name: "Yearly Plan",
//     price: "PKR 8,999",
//     duration: "12 Months",
//   },
// ];

// const PaymentVerificationPanel = () => {
//   const [payments, setPayments] = useState([
//     {
//       id: 1,
//       name: "Ahmad Ali",
//       email: "ahmad@example.com",
//       phone: "03001234567",
//       planId: "monthly",
//       method: "HBL Bank Transfer",
//       transactionId: "TXN123456",
//       status: "pending",
//       submittedAt: "2025-05-29 10:30",
//       receiptUrl:
//         "https://static.vecteezy.com/system/resources/thumbnails/034/455/647/small_2x/corporate-modern-money-receipt-template-design-withdrawal-slip-design-template-vector.jpg",
//     },
//     {
//       id: 2,
//       name: "Sara Khan",
//       email: "sara@example.com",
//       phone: "03009876543",
//       planId: "weekly",
//       method: "JazzCash",
//       transactionId: "JC789012",
//       status: "verified",
//       submittedAt: "2025-05-28 15:45",
//       receiptUrl:
//         "https://png.pngtree.com/template/20230329/ourmid/pngtree-money-receipt-vector-image_1956547.jpg",
//     },
//     {
//       id: 3,
//       name: "Hassan Ahmed",
//       email: "hassan@example.com",
//       phone: "03007654321",
//       planId: "yearly",
//       method: "Easypaisa",
//       transactionId: "EP456789",
//       status: "pending",
//       submittedAt: "2025-05-29 14:20",
//       receiptUrl:
//         "https://mir-s3-cdn-cf.behance.net/project_modules/hd/c11c6794246723.5e7a1eb135087.jpg",
//     },

//   ]);

//   const [editingPayment, setEditingPayment] = useState(null);
//   const [viewingReceipt, setViewingReceipt] = useState(null);
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const paymentsPerPage = 20;

//   const getPlanDetails = (planId) =>
//     subscriptionPlans.find((plan) => plan.id === planId) || {};

//   const updatePaymentStatus = (id, newStatus) => {
//     setPayments(
//       payments.map((payment) =>
//         payment.id === id ? { ...payment, status: newStatus } : payment
//       )
//     );
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "bg-yellow-700 text-yellow-200",
//       verified: "bg-green-700 text-green-100",
//       rejected: "bg-red-700 text-red-100",
//     };
//     return badges[status] || badges.pending;
//   };

//   const getStatusCount = (status) =>
//     payments.filter((p) => p.status === status).length;

//   const getFilteredPayments = () => {
//     if (activeFilter === "all") {
//       return payments;
//     }
//     return payments.filter((payment) => payment.status === activeFilter);
//   };

//   const getPaginatedPayments = () => {
//     const filtered = getFilteredPayments();
//     const startIndex = (currentPage - 1) * paymentsPerPage;
//     const endIndex = startIndex + paymentsPerPage;
//     return filtered.slice(startIndex, endIndex);
//   };

//   const getTotalPages = () => {
//     const filtered = getFilteredPayments();
//     return Math.ceil(filtered.length / paymentsPerPage);
//   };

//   const handleFilterChange = (filterType) => {
//     setActiveFilter(filterType);
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingPayment({ ...editingPayment, [name]: value });
//   };

//   const saveEdit = () => {
//     setPayments(
//       payments.map((p) => (p.id === editingPayment.id ? editingPayment : p))
//     );
//     setEditingPayment(null);
//   };

//   const getFilterButtonClass = (filterType) => {
//     const baseClass = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap";

//     if (activeFilter === filterType) {
//       const activeClasses = {
//         all: "bg-blue-700 text-blue-100 ring-2 ring-blue-400",
//         pending: "bg-yellow-700 text-yellow-200 ring-2 ring-yellow-400",
//         verified: "bg-green-700 text-green-100 ring-2 ring-green-400",
//         rejected: "bg-red-700 text-red-100 ring-2 ring-red-400",
//       };
//       return `${baseClass} ${activeClasses[filterType]}`;
//     }

//     const inactiveClasses = {
//       all: "bg-gray-700 text-gray-300 hover:bg-blue-800 hover:text-blue-200",
//       pending: "bg-gray-700 text-gray-300 hover:bg-yellow-800 hover:text-yellow-200",
//       verified: "bg-gray-700 text-gray-300 hover:bg-green-800 hover:text-green-200",
//       rejected: "bg-gray-700 text-gray-300 hover:bg-red-800 hover:text-red-200",
//     };
//     return `${baseClass} ${inactiveClasses[filterType]}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Back link */}
//         <div className="flex items-center space-x-2">
//           <ArrowLeft className="w-5 h-5 text-cyan-400" />
//           <button className="text-cyan-300 hover:text-cyan-100 font-medium">
//             Back to Dashboard
//           </button>
//         </div>

//         {/* Pagination */}
//         {getTotalPages() > 1 && (
//           <div className="flex justify-center items-center space-x-2 mt-6">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
//             >
//               Previous
//             </button>

//             <div className="flex space-x-1">
//               {[...Array(getTotalPages())].map((_, index) => {
//                 const pageNumber = index + 1;
//                 const isCurrentPage = pageNumber === currentPage;

//                 // Show first page, last page, current page, and pages around current page
//                 if (
//                   pageNumber === 1 ||
//                   pageNumber === getTotalPages() ||
//                   (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                 ) {
//                   return (
//                     <button
//                       key={pageNumber}
//                       onClick={() => setCurrentPage(pageNumber)}
//                       className={`px-3 py-2 rounded-lg transition-colors ${
//                         isCurrentPage
//                           ? "bg-cyan-600 text-white"
//                           : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                       }`}
//                     >
//                       {pageNumber}
//                     </button>
//                   );
//                 }

//                 // Show ellipsis
//                 if (
//                   pageNumber === currentPage - 2 ||
//                   pageNumber === currentPage + 2
//                 ) {
//                   return (
//                     <span key={pageNumber} className="px-2 py-2 text-gray-500">
//                       ...
//                     </span>
//                   );
//                 }

//                 return null;
//               })}
//             </div>

//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
//               disabled={currentPage === getTotalPages()}
//               className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Panel Title and Filter Buttons */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//           <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-md">
//             🎮 Payment Verification Panel
//           </h1>
//           <div className="flex flex-wrap gap-2">
//             <span
//               className={getFilterButtonClass("all")}
//               onClick={() => handleFilterChange("all")}
//             >
//               All: {payments.length}
//             </span>
//             <span
//               className={getFilterButtonClass("pending")}
//               onClick={() => handleFilterChange("pending")}
//             >
//               Pending: {getStatusCount("pending")}
//             </span>
//             <span
//               className={getFilterButtonClass("verified")}
//               onClick={() => handleFilterChange("verified")}
//             >
//               Verified: {getStatusCount("verified")}
//             </span>
//             <span
//               className={getFilterButtonClass("rejected")}
//               onClick={() => handleFilterChange("rejected")}
//             >
//               Rejected: {getStatusCount("rejected")}
//             </span>
//           </div>
//         </div>

//         {/* Payment Table */}
//         <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
//             <h3 className="text-lg font-bold text-cyan-300">
//               Payment Submissions {activeFilter !== "all" && `- ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
//             </h3>
//             <div className="text-sm text-gray-400">
//               Showing {getPaginatedPayments().length} of {getFilteredPayments().length} payments
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead className="bg-gray-700">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-cyan-200 uppercase tracking-wider">
//                     Customer Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-cyan-200 uppercase tracking-wider">
//                     Plan & Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-cyan-200 uppercase tracking-wider">
//                     Payment Method
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-cyan-200 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-cyan-200 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-gray-900 divide-y divide-gray-800">
//                 {getPaginatedPayments().length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
//                       No payments found for {activeFilter === "all" ? "any status" : activeFilter + " status"}
//                     </td>
//                   </tr>
//                 ) : (
//                   getPaginatedPayments().map((payment) => {
//                     const plan = getPlanDetails(payment.planId);
//                     return (
//                       <tr key={payment.id} className="hover:bg-gray-700">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>
//                             <div className="text-sm font-bold text-white">
//                               {payment.name}
//                             </div>
//                             <div className="text-sm text-gray-400 flex items-center">
//                               📧 {payment.email}
//                             </div>
//                             <div className="text-sm text-gray-400 flex items-center">
//                               📱 {payment.phone}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-bold text-white">
//                             {plan.name}
//                           </div>
//                           <div className="text-sm text-green-300 font-semibold">
//                             {plan.price}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                           <div>{payment.method}</div>
//                           <div className="text-xs text-gray-400">
//                             ID: {payment.transactionId}
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             {payment.submittedAt}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(
//                               payment.status
//                             )}`}
//                           >
//                             {payment.status.charAt(0).toUpperCase() +
//                               payment.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex flex-col space-y-2">
//                             <button
//                               className="text-cyan-400 hover:text-cyan-200 inline-flex items-center"
//                               onClick={() =>
//                                 setViewingReceipt(payment.receiptUrl)
//                               }
//                             >
//                               <Eye className="w-4 h-4 mr-1" /> View Receipt
//                             </button>
//                             {payment.status === "pending" && (
//                               <div className="flex space-x-2">
//                                 <button
//                                   onClick={() =>
//                                     updatePaymentStatus(payment.id, "verified")
//                                   }
//                                   className="text-green-400 hover:text-green-200 inline-flex items-center"
//                                 >
//                                   <Check className="w-4 h-4 mr-1" /> Approve
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     updatePaymentStatus(payment.id, "rejected")
//                                   }
//                                   className="text-red-400 hover:text-red-200 inline-flex items-center"
//                                 >
//                                   <X className="w-4 h-4 mr-1" /> Reject
//                                 </button>
//                               </div>
//                             )}
//                             <button
//                               onClick={() => setEditingPayment(payment)}
//                               className="text-yellow-400 hover:text-yellow-300 inline-flex items-center"
//                             >
//                               <Pencil className="w-4 h-4 mr-1" /> Edit
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Edit Modal */}
// {editingPayment && (
//   <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//     <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
//       <h2 className="text-lg font-bold mb-4 text-cyan-300">
//         Edit Payment
//       </h2>
//       <div className="space-y-3">
//         <input
//           name="name"
//           value={editingPayment.name}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//           placeholder="Name"
//         />
//         <input
//           name="email"
//           value={editingPayment.email}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//           placeholder="Email"
//         />
//         <input
//           name="phone"
//           value={editingPayment.phone}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//           placeholder="Phone"
//         />
//         <input
//           name="method"
//           value={editingPayment.method}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//           placeholder="Payment Method"
//         />
//         <input
//           name="transactionId"
//           value={editingPayment.transactionId}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//           placeholder="Transaction ID"
//         />
//         <select
//           name="planId"
//           value={editingPayment.planId}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//         >
//           {subscriptionPlans.map((plan) => (
//             <option key={plan.id} value={plan.id}>
//               {plan.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="status"
//           value={editingPayment.status}
//           onChange={handleEditChange}
//           className="w-full p-2 bg-gray-700 rounded"
//         >
//           <option value="pending">Pending</option>
//           <option value="verified">Verified</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>
//       <div className="flex justify-end mt-6 space-x-3">
//         <button
//           onClick={saveEdit}
//           className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
//         >
//           Save
//         </button>
//         <button
//           onClick={() => setEditingPayment(null)}
//           className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {/* Receipt Modal */}
// {viewingReceipt && (
//   <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//     <div className="bg-gray-900 rounded-xl p-4 max-w-2xl w-full shadow-2xl">
//       <img
//         src={viewingReceipt}
//         alt="Receipt"
//         className="rounded-lg w-full max-h-[80vh] object-contain"
//       />
//       <div className="text-right mt-4">
//         <button
//           onClick={() => setViewingReceipt(null)}
//           className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );
// };

// export default PaymentVerificationPanel;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllPayments,
//   verifyPaymentById,
//   rejectPaymentById,
//   updatePaymentById,
// } from "../../../redux/features/paymentSlice";
// import { Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

// const PaymentVerificationPanel = () => {
//   const dispatch = useDispatch();
//   const { adminPayments, pagination, loading, error } = useSelector(
//     (state) => state.payment
//   );

//   const [statusFilter, setStatusFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limitPerPage, setLimitPerPage] = useState(10);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState(null);
//   const [viewingReceipt, setViewingReceipt] = useState(null);
//   // Add this state to your existing useState declarations
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchFilter, setSearchFilter] = useState("all"); // all, name, email, phone, transactionId, paymentMethod, plan

//   // Add this function to filter payments based on search term
//   const getFilteredPayments = () => {
//     if (!searchTerm.trim()) {
//       return adminPayments;
//     }

//     const searchLower = searchTerm.toLowerCase().trim();

//     return adminPayments.filter((payment) => {
//       const customerName = payment.userDetails?.fullName?.toLowerCase() || "";
//       const customerEmail = payment.userDetails?.email?.toLowerCase() || "";
//       const customerPhone =
//         payment.userDetails?.phoneNumber?.toLowerCase() || "";
//       const transactionId = (
//         payment.paymentDetails?.transactionId ||
//         payment.paymentDetails?.referenceId ||
//         ""
//       ).toLowerCase();
//       const paymentMethod = (
//         payment.paymentDetails?.paymentMethod ||
//         payment.paymentDetails?.paymentMethodName ||
//         ""
//       ).toLowerCase();
//       const planName = payment.selectedPlan?.planName?.toLowerCase() || "";

//       switch (searchFilter) {
//         case "name":
//           return customerName.includes(searchLower);
//         case "email":
//           return customerEmail.includes(searchLower);
//         case "phone":
//           return customerPhone.includes(searchLower);
//         case "transactionId":
//           return transactionId.includes(searchLower);
//         case "paymentMethod":
//           return paymentMethod.includes(searchLower);
//         case "plan":
//           return planName.includes(searchLower);
//         case "all":
//         default:
//           return (
//             customerName.includes(searchLower) ||
//             customerEmail.includes(searchLower) ||
//             customerPhone.includes(searchLower) ||
//             transactionId.includes(searchLower) ||
//             paymentMethod.includes(searchLower) ||
//             planName.includes(searchLower)
//           );
//       }
//     });
//   };

//   // Add this function to clear search
//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSearchFilter("all");
//   };

//   // New state for confirmation modals
//   const [confirmationModal, setConfirmationModal] = useState({
//     isOpen: false,
//     type: null, // 'approve' or 'reject'
//     paymentId: null,
//     paymentDetails: null,
//   });

//   const [editFormData, setEditFormData] = useState({
//     userDetails: {
//       fullName: "",
//       email: "",
//       phoneNumber: "",
//     },
//     paymentDetails: {
//       paymentMethod: "",
//       transactionId: "",
//     },
//     selectedPlan: {
//       planId: "",
//     },
//   });

//   useEffect(() => {
//     const queryParams = {
//       page: currentPage,
//       limit: limitPerPage,
//       ...(statusFilter && { status: statusFilter }),
//     };
//     dispatch(getAllPayments(queryParams));
//   }, [statusFilter, currentPage, limitPerPage, dispatch]);

//   // Open confirmation modal for approve
//   const handleApproveClick = (payment) => {
//     setConfirmationModal({
//       isOpen: true,
//       type: "approve",
//       paymentId: payment.paymentId,
//       paymentDetails: payment,
//     });
//   };

//   // Open confirmation modal for reject
//   const handleRejectClick = (payment) => {
//     setConfirmationModal({
//       isOpen: true,
//       type: "reject",
//       paymentId: payment.paymentId,
//       paymentDetails: payment,
//     });
//   };

//   // Close confirmation modal
//   const closeConfirmationModal = () => {
//     setConfirmationModal({
//       isOpen: false,
//       type: null,
//       paymentId: null,
//       paymentDetails: null,
//     });
//   };

//   // Handle confirmed approve
//   const handleConfirmedApprove = async () => {
//     try {
//       await dispatch(verifyPaymentById(confirmationModal.paymentId)).unwrap();

//       const queryParams = {
//         page: currentPage,
//         limit: limitPerPage,
//         ...(statusFilter && { status: statusFilter }),
//       };
//       dispatch(getAllPayments(queryParams));

//       // Optional: Show success message
//       alert("Payment approved successfully!");
//     } catch (error) {
//       console.error("Failed to approve payment:", error);
//       alert("Failed to approve payment: " + (error.message || error));
//     } finally {
//       closeConfirmationModal();
//     }
//   };

//   // Handle confirmed reject
//   const handleConfirmedReject = async () => {
//     try {
//       await dispatch(rejectPaymentById(confirmationModal.paymentId)).unwrap();

//       const queryParams = {
//         page: currentPage,
//         limit: limitPerPage,
//         ...(statusFilter && { status: statusFilter }),
//       };
//       dispatch(getAllPayments(queryParams));

//       // Optional: Show success message
//       alert("Payment rejected successfully!");
//     } catch (error) {
//       console.error("Failed to reject payment:", error);
//       alert("Failed to reject payment: " + (error.message || error));
//     } finally {
//       closeConfirmationModal();
//     }
//   };

//   const handleEdit = (payment) => {
//     setEditingPayment(payment);
//     setEditFormData({
//       userDetails: {
//         fullName: payment.userDetails?.fullName || "",
//         email: payment.userDetails?.email || "",
//         phoneNumber: payment.userDetails?.phoneNumber || "",
//       },
//       paymentDetails: {
//         paymentMethod: payment.paymentDetails?.paymentMethod || "",
//         transactionId:
//           payment.paymentDetails?.transactionId ||
//           payment.paymentDetails?.referenceId ||
//           "",
//       },
//       selectedPlan: {
//         planId: payment.selectedPlan?.planId || "",
//       },
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleEditFormChange = (section, field, value) => {
//     setEditFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   const handleSaveEdit = async () => {
//     if (!editingPayment) return;

//     try {
//       await dispatch(
//         updatePaymentById({
//           paymentId: editingPayment.paymentId,
//           updatedData: editFormData,
//         })
//       ).unwrap();

//       setIsEditModalOpen(false);
//       setEditingPayment(null);

//       // Refresh the payments list
//       const queryParams = {
//         page: currentPage,
//         limit: limitPerPage,
//         ...(statusFilter && { status: statusFilter }),
//       };
//       dispatch(getAllPayments(queryParams));

//       // Optional: Show success message
//       alert("Payment updated successfully!");
//     } catch (error) {
//       console.error("Failed to update payment:", error);
//       alert("Failed to update payment: " + (error.message || error));
//     }
//   };

//   const handleViewReceipt = (payment) => {
//     if (payment?.paymentReceipt?.fileName) {
//       const fileUrl = `${process.env.REACT_APP_BACKEND}/uploads/receipts/${payment.paymentReceipt.fileName}`;
//       setViewingReceipt(fileUrl);
//     } else {
//       alert("No receipt uploaded for this payment.");
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return (
//       date.toLocaleDateString("en-GB") +
//       " " +
//       date.toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "verified":
//       case "approved":
//         return "text-green-400";
//       case "pending":
//         return "text-yellow-400";
//       case "rejected":
//         return "text-red-400";
//       case "expired":
//         return "text-orange-400";
//       default:
//         return "text-gray-400";
//     }
//   };

//   // Pagination handlers
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleLimitChange = (limit) => {
//     setLimitPerPage(limit);
//     setCurrentPage(1); // Reset to first page when changing limit
//   };

//   const handleStatusFilterChange = (value) => {
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   const statusButtons = [
//     { label: "All", value: "" },
//     { label: "Verified", value: "verified" },
//     { label: "Pending", value: "pending" },
//     { label: "Rejected", value: "rejected" },
//     { label: "Expired", value: "expired" },
//   ];

//   const paymentMethods = [
//     { value: "hbl", label: "HBL Bank Transfer" },
//     { value: "ubl", label: "UBL Bank Transfer" },
//     { value: "mcb", label: "MCB Bank Transfer" },
//     { value: "jazzcash", label: "JazzCash" },
//     { value: "easypaisa", label: "Easypaisa" },
//   ];

//   const plans = [
//     { value: "weekly", label: "Weekly Plan - PKR 350" },
//     { value: "monthly", label: "Monthly Plan - PKR 999" },
//     { value: "yearly", label: "Yearly Plan - PKR 8,999" },
//   ];

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white">
//       <div className="flex items-center space-x-2 p-4">
//       <ArrowLeft className="w-5 h-5 text-fuchsia-400" />
//       <Link to="/dashboard" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">
//         Back to Dashboard
//       </Link>
//     </div>
//       <h1 className="text-3xl font-bold mb-6 text-center text-fuchsia-400 drop-shadow-lg">
//         Payment Verification Panel
//       </h1>

//       <div className="flex justify-center gap-4 mb-6 flex-wrap">
//         {statusButtons.map(({ label, value }) => (
//           <button
//             key={value}
//             onClick={() => handleStatusFilterChange(value)}
//             className={`px-4 py-2 rounded-md border text-sm font-semibold transition-all duration-300 ${
//               statusFilter === value
//                 ? "bg-fuchsia-600 border-fuchsia-400 text-white"
//                 : "bg-gray-700 border-gray-600 hover:bg-fuchsia-700 hover:border-fuchsia-400"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* Search Section */}
// <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
//   <div className="flex flex-col lg:flex-row gap-4 items-center">
//     {/* Search Input */}
//     <div className="flex-1 w-full lg:w-auto">
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search payments..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400"
//         />
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//           </svg>
//         </div>
//       </div>
//     </div>

//     {/* Search Filter Dropdown */}
//     <div className="w-full lg:w-auto">
//       <select
//         value={searchFilter}
//         onChange={(e) => setSearchFilter(e.target.value)}
//         className="w-full lg:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//       >
//         <option value="all">Search All Fields</option>
//         <option value="name">Customer Name</option>
//         <option value="email">Email</option>
//         <option value="phone">Phone Number</option>
//         <option value="transactionId">Transaction ID</option>
//         <option value="paymentMethod">Payment Method</option>
//         <option value="plan">Plan Name</option>
//       </select>
//     </div>

//     {/* Clear Search Button */}
//     {searchTerm && (
//       <button
//         onClick={handleClearSearch}
//         className="w-full lg:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
//       >
//         Clear Search
//       </button>
//     )}
//   </div>

//   {/* Search Results Info */}
//   {searchTerm && (
//     <div className="mt-3 text-sm text-gray-300">
//       <span className="text-fuchsia-300 font-medium">
//         {getFilteredPayments().length}
//       </span>{" "}
//       result(s) found for "{searchTerm}"
//       {searchFilter !== "all" && (
//         <span className="text-gray-400">
//           {" "}in {searchFilter === "transactionId" ? "Transaction ID" :
//                   searchFilter === "paymentMethod" ? "Payment Method" :
//                   searchFilter === "phone" ? "Phone Number" :
//                   searchFilter.charAt(0).toUpperCase() + searchFilter.slice(1)}
//         </span>
//       )}
//     </div>
//   )}
// </div>

//       {/* Results per page selector */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-2 text-sm text-gray-300">
//           <span>Show:</span>
//           <select
//             value={limitPerPage}
//             onChange={(e) => handleLimitChange(parseInt(e.target.value))}
//             className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded focus:outline-none focus:border-fuchsia-400"
//           >
//             <option value={5}>5 per page</option>
//             <option value={10}>10 per page</option>
//             <option value={20}>20 per page</option>
//             <option value={50}>50 per page</option>
//           </select>
//         </div>

//         {pagination && (
//           <div className="text-sm text-gray-300">
//             Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//             {Math.min(
//               pagination.currentPage * pagination.limit,
//               pagination.totalCount
//             )}{" "}
//             of {pagination.totalCount} results
//           </div>
//         )}
//       </div>

//       {loading ? (
//         <p className="text-center text-lg animate-pulse text-fuchsia-300">
//           Loading payments...
//         </p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <div className="overflow-x-auto shadow-xl rounded-lg">
//           <table className="min-w-full text-sm text-left border border-gray-700">
//             <thead className="bg-gray-800 text-fuchsia-300 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3 font-bold">Customer Details</th>
//                 <th className="px-4 py-3 font-bold">Plan & Amount</th>
//                 <th className="px-4 py-3 font-bold">Payment Method</th>
//                 <th className="px-4 py-3 font-bold">Status</th>
//                 <th className="px-4 py-3 font-bold">Subscription</th>
//                 <th className="px-4 py-3 font-bold text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* {adminPayments && adminPayments.length > 0 ? (
//                 adminPayments.map((payment) => ( */}
//                 {getFilteredPayments() && getFilteredPayments().length > 0 ? (
//                 getFilteredPayments().map((payment) => (
//                   <tr
//                     key={payment._id}
//                     className="border-t border-gray-700 hover:bg-gray-800"
//                   >
//                     {/* Customer Details */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-1">
//                         <div className="font-semibold text-white">
//                           {payment.userDetails?.fullName || "N/A"}
//                         </div>
//                         <div className="text-gray-300 text-xs flex items-center">
//                           <span className="mr-1">📧</span>
//                           {payment.userDetails?.email || "N/A"}
//                         </div>
//                         <div className="text-gray-300 text-xs flex items-center">
//                           <span className="mr-1">📱</span>
//                           {payment.userDetails?.phoneNumber || "N/A"}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Plan & Amount */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-1">
//                         <div className="font-semibold text-white">
//                           {payment.selectedPlan?.planName || "N/A"}
//                         </div>
//                         <div className="font-bold text-fuchsia-300">
//                           {payment.selectedPlan?.planPrice ||
//                             payment.paymentDetails?.amount ||
//                             "N/A"}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Payment Method */}
//                     <td className="px-4 py-3">
//                       <div className="space-y-1">
//                         <div className="font-medium text-white">
//                           {payment.paymentDetails?.paymentMethod ||
//                             payment.paymentDetails?.paymentMethodName ||
//                             "N/A"}
//                         </div>
//                         <div className="text-gray-300 text-xs">
//                           ID:{" "}
//                           {payment.paymentDetails?.transactionId ||
//                             payment.paymentDetails?.referenceId ||
//                             "N/A"}
//                         </div>
//                         <div className="text-gray-400 text-xs">
//                           {formatDate(
//                             payment.paymentDetails?.submissionDate ||
//                               payment.createdAt
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`font-bold capitalize ${getStatusColor(
//                           payment.paymentStatus?.status
//                         )}`}
//                       >
//                         {payment.paymentStatus?.status || "N/A"}
//                       </span>
//                     </td>

//                     {/* Subscription Details - Only show if status is verified */}
//                     <td className="px-4 py-3">
//                       {payment.paymentStatus?.status === "verified" ? (
//                         <div className="space-y-1">
//                           <div className="text-green-400 font-medium text-xs flex items-center">
//                             {payment.paymentStatus?.isActive ? (
//                               <>
//                                 <span className="mr-1">✅</span>
//                                 Active Subscription
//                               </>
//                             ) : (
//                               <>
//                                 <span className="mr-1">⏸️</span>
//                                 Inactive Subscription
//                               </>
//                             )}
//                           </div>
//                           <div className="text-gray-300 text-xs">
//                             <div className="flex items-center">
//                               <span className="mr-1">🚀</span>
//                               Start: {formatDate(payment.paymentStatus?.subscriptionStartDate)}
//                             </div>
//                             <div className="flex items-center mt-1">
//                               <span className="mr-1">⏰</span>
//                               End: {formatDate(payment.paymentStatus?.subscriptionEndDate)}
//                             </div>
//                           </div>
//                           {/* Days remaining indicator */}
//                           <div className="text-xs">
//                             {(() => {
//                               const endDate = new Date(payment.paymentStatus?.subscriptionEndDate);
//                               const today = new Date();
//                               const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
//                               return (
//                                 <span className={`${daysLeft > 7 ? 'text-green-400' : daysLeft > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
//                                   {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
//                                 </span>
//                               );
//                             })()}
//                           </div>
//                           {/* Expiry Date */}
//                           <div className="text-gray-400 text-xs mt-1">
//                             <span className="mr-1">📅</span>
//                             Expires: {formatDate(payment.paymentStatus?.expiryDate)}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-gray-500 text-xs">
//                           <span className="italic">
//                             {payment.paymentStatus?.status === "pending" ? "Awaiting approval" : "No subscription"}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-3">
//                       <div className="flex flex-col gap-1">
//                         <button
//                           onClick={() => handleViewReceipt(payment)}
//                           className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs transition-colors"
//                         >
//                           View Receipt
//                         </button>

//                         {payment.paymentStatus?.status === "pending" && (
//                           <>
//                             <button
//                               onClick={() => handleApproveClick(payment)}
//                               className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-bold transition-colors"
//                               disabled={loading}
//                             >
//                               {loading ? "Processing..." : "Approve"}
//                             </button>
//                             <button
//                               onClick={() => handleRejectClick(payment)}
//                               className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-bold transition-colors"
//                               disabled={loading}
//                             >
//                               {loading ? "Processing..." : "Reject"}
//                             </button>
//                           </>
//                         )}

//                         <button
//                           onClick={() => handleEdit(payment)}
//                           className="px-2 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-xs transition-colors"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-4 py-8 text-center text-gray-400"
//                   >
//                     {/* =============== CHANGE THIS SECTION =============== */}
//                     {searchTerm ? (
//                       <div className="space-y-2">
//                         <p>No payments found matching your search criteria</p>
//                         <button
//                           onClick={handleClearSearch}
//                           className="text-fuchsia-400 hover:text-fuchsia-300 underline text-sm"
//                         >
//                           Clear search to show all payments
//                         </button>
//                       </div>
//                     ) : (
//                       "No payments found"
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="flex justify-center items-center mt-6 gap-2">
//           {/* Previous button */}
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={!pagination.hasPrevPage}
//             className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//               pagination.hasPrevPage
//                 ? "bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600"
//                 : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
//             }`}
//           >
//             Previous
//           </button>

//           {/* Page numbers */}
//           {Array.from(
//             { length: Math.min(5, pagination.totalPages) },
//             (_, i) => {
//               let pageNumber;

//               if (pagination.totalPages <= 5) {
//                 pageNumber = i + 1;
//               } else {
//                 // Show pages around current page
//                 const start = Math.max(1, pagination.currentPage - 2);
//                 const end = Math.min(pagination.totalPages, start + 4);
//                 const adjustedStart = Math.max(1, end - 4);
//                 pageNumber = adjustedStart + i;
//               }

//               if (pageNumber > pagination.totalPages) return null;

//               return (
//                 <button
//                   key={pageNumber}
//                   onClick={() => handlePageChange(pageNumber)}
//                   className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
//                     pagination.currentPage === pageNumber
//                       ? "bg-fuchsia-600 text-white border-fuchsia-400"
//                       : "bg-gray-700 text-white hover:bg-fuchsia-600 border-gray-600"
//                   }`}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             }
//           )}

//           {/* Show ellipsis if needed */}
//           {pagination.totalPages > 5 &&
//             pagination.currentPage < pagination.totalPages - 2 && (
//               <>
//                 <span className="text-gray-400 px-2">...</span>
//                 <button
//                   onClick={() => handlePageChange(pagination.totalPages)}
//                   className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600 transition-colors"
//                 >
//                   {pagination.totalPages}
//                 </button>
//               </>
//             )}

//           {/* Next button */}
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={!pagination.hasNextPage}
//             className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//               pagination.hasNextPage
//                 ? "bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600"
//                 : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Confirmation Modal for Approve/Reject */}
//       {confirmationModal.isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
//             <div className="p-6">
//               {/* Header */}
//               <div className="flex items-center mb-4">
//                 {confirmationModal.type === "approve" ? (
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                       <svg
//                         className="w-5 h-5 text-green-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M5 13l4 4L19 7"
//                         ></path>
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-semibold text-white">
//                       Approve Payment
//                     </h3>
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
//                       <svg
//                         className="w-5 h-5 text-red-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M6 18L18 6M6 6l12 12"
//                         ></path>
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-semibold text-white">
//                       Reject Payment
//                     </h3>
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="mb-6">
//                 <p className="text-gray-300 mb-4">
//                   Are you sure you want to {confirmationModal.type} this
//                   payment?
//                 </p>

//                 {/* Payment Details */}
//                 {confirmationModal.paymentDetails && (
//                   <div className="bg-gray-700 p-4 rounded-lg space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-400">Customer:</span>
//                       <span className="text-white font-medium">
//                         {confirmationModal.paymentDetails.userDetails
//                           ?.fullName || "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-400">Plan:</span>
//                       <span className="text-white">
//                         {confirmationModal.paymentDetails.selectedPlan
//                           ?.planName || "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-400">Amount:</span>
//                       <span className="text-fuchsia-300 font-bold">
//                         {confirmationModal.paymentDetails.selectedPlan
//                           ?.planPrice ||
//                           confirmationModal.paymentDetails.paymentDetails
//                             ?.amount ||
//                           "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-400">Transaction ID:</span>
//                       <span className="text-white text-sm">
//                         {confirmationModal.paymentDetails.paymentDetails
//                           ?.transactionId ||
//                           confirmationModal.paymentDetails.paymentDetails
//                             ?.referenceId ||
//                           "N/A"}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={closeConfirmationModal}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={
//                     confirmationModal.type === "approve"
//                       ? handleConfirmedApprove
//                       : handleConfirmedReject
//                   }
//                   className={`px-4 py-2 rounded-md font-semibold transition-colors ${
//                     confirmationModal.type === "approve"
//                       ? "bg-green-600 hover:bg-green-700 text-white"
//                       : "bg-red-600 hover:bg-red-700 text-white"
//                   }`}
//                   disabled={loading}
//                 >
//                   {loading
//                     ? "Processing..."
//                     : confirmationModal.type === "approve"
//                     ? "Approve"
//                     : "Reject"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Payment Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-4 sm:p-6">
//               {/* Header */}
//               <div className="flex justify-between items-center mb-4 sm:mb-6">
//                 <h2 className="text-xl sm:text-2xl font-bold text-fuchsia-400">
//                   Edit Payment
//                 </h2>
//                 <button
//                   onClick={() => setIsEditModalOpen(false)}
//                   className="text-gray-400 hover:text-white text-2xl font-bold"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-5 sm:space-y-6">
//                 {/* Customer Details Section */}
//                 <div className="bg-gray-700 p-4 rounded-lg">
//                   <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
//                     Customer Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         value={editFormData.userDetails.fullName}
//                         onChange={(e) =>
//                           handleEditFormChange(
//                             "userDetails",
//                             "fullName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         value={editFormData.userDetails.email}
//                         onChange={(e) =>
//                           handleEditFormChange(
//                             "userDetails",
//                             "email",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Phone Number
//                       </label>
//                       <input
//                         type="text"
//                         value={editFormData.userDetails.phoneNumber}
//                         onChange={(e) =>
//                           handleEditFormChange(
//                             "userDetails",
//                             "phoneNumber",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Details Section */}
//                 <div className="bg-gray-700 p-4 rounded-lg">
//                   <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
//                     Payment Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Payment Method
//                       </label>
//                       <select
//                         value={editFormData.paymentDetails.paymentMethod}
//                         onChange={(e) =>
//                           handleEditFormChange(
//                             "paymentDetails",
//                             "paymentMethod",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                       >
//                         <option value="">Select Payment Method</option>
//                         {paymentMethods.map((method) => (
//                           <option key={method.value} value={method.value}>
//                             {method.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Transaction ID
//                       </label>
//                       <input
//                         type="text"
//                         value={editFormData.paymentDetails.transactionId}
//                         onChange={(e) =>
//                           handleEditFormChange(
//                             "paymentDetails",
//                             "transactionId",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Subscription Plan Section */}
//                 <div className="bg-gray-700 p-4 rounded-lg">
//                   <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
//                     Subscription Plan
//                   </h3>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Plan
//                     </label>
//                     <select
//                       value={editFormData.selectedPlan.planId}
//                       onChange={(e) =>
//                         handleEditFormChange(
//                           "selectedPlan",
//                           "planId",
//                           e.target.value
//                         )
//                       }
//                       className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
//                     >
//                       <option value="">Select Plan</option>
//                       {plans.map((plan) => (
//                         <option key={plan.value} value={plan.value}>
//                           {plan.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Current Payment Info */}
//                 {editingPayment && (
//                   <div className="bg-gray-700 p-4 rounded-lg">
//                     <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
//                       Current Payment Info
//                     </h3>
//                     <div className="text-sm text-gray-300 space-y-2">
//                       <p>
//                         <span className="font-medium">Payment ID:</span>{" "}
//                         {editingPayment.paymentId}
//                       </p>
//                       <p>
//                         <span className="font-medium">Status:</span>
//                         <span
//                           className={`ml-2 font-bold capitalize ${getStatusColor(
//                             editingPayment.paymentStatus?.status
//                           )}`}
//                         >
//                           {editingPayment.paymentStatus?.status}
//                         </span>
//                       </p>
//                       <p>
//                         <span className="font-medium">Created:</span>{" "}
//                         {formatDate(editingPayment.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Modal Actions */}
//               <div className="flex justify-end gap-4 mt-5 sm:mt-6 pt-4 border-t border-gray-600">
//                 <button
//                   onClick={() => setIsEditModalOpen(false)}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveEdit}
//                   className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors font-semibold"
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Receipt Modal */}
//       {viewingReceipt && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//           <div className="bg-gray-900 rounded-xl p-4 max-w-2xl w-full shadow-2xl">
//             <img
//               src={viewingReceipt}
//               alt="Receipt"
//               className="rounded-lg w-full max-h-[80vh] object-contain"
//             />
//             <div className="text-right mt-4">
//               <button
//                 onClick={() => setViewingReceipt(null)}
//                 className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white font-semibold"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentVerificationPanel;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPayments,
  verifyPaymentById,
  rejectPaymentById,
  updatePaymentById,
} from "../../../redux/features/paymentSlice";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from 'react-hot-toast';

const PaymentVerificationPanel = () => {
  const dispatch = useDispatch();
  const { adminPayments, pagination, loading, error } = useSelector(
    (state) => state.payment
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  // Add this state to your existing useState declarations
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all"); // all, name, email, phone, transactionId, paymentMethod, plan

  // Add this function to filter payments based on search term
  const getFilteredPayments = () => {
    if (!searchTerm.trim()) {
      return adminPayments;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return adminPayments.filter((payment) => {
      const customerName = payment.userDetails?.fullName?.toLowerCase() || "";
      const customerEmail = payment.userDetails?.email?.toLowerCase() || "";
      const customerPhone =
        payment.userDetails?.phoneNumber?.toLowerCase() || "";
      const transactionId = (
        payment.paymentDetails?.transactionId ||
        payment.paymentDetails?.referenceId ||
        ""
      ).toLowerCase();
      const paymentMethod = (
        payment.paymentDetails?.paymentMethod ||
        payment.paymentDetails?.paymentMethodName ||
        ""
      ).toLowerCase();
      const planName = payment.selectedPlan?.planName?.toLowerCase() || "";
      const rejectionReason =
        payment.paymentStatus?.rejectionReason?.toLowerCase() || "";

      switch (searchFilter) {
        case "name":
          return customerName.includes(searchLower);
        case "email":
          return customerEmail.includes(searchLower);
        case "phone":
          return customerPhone.includes(searchLower);
        case "transactionId":
          return transactionId.includes(searchLower);
        case "paymentMethod":
          return paymentMethod.includes(searchLower);
        case "plan":
          return planName.includes(searchLower);
        case "rejectionReason":
          return rejectionReason.includes(searchLower);
        case "all":
        default:
          return (
            customerName.includes(searchLower) ||
            customerEmail.includes(searchLower) ||
            customerPhone.includes(searchLower) ||
            transactionId.includes(searchLower) ||
            paymentMethod.includes(searchLower) ||
            planName.includes(searchLower) ||
            rejectionReason.includes(searchLower)
          );
      }
    });
  };

  // Add this function to clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchFilter("all");
  };

  // New state for confirmation modals
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    paymentId: null,
    paymentDetails: null,
  });

  const [editFormData, setEditFormData] = useState({
    userDetails: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
    paymentDetails: {
      paymentMethod: "",
      transactionId: "",
    },
    selectedPlan: {
      planId: "",
    },
    paymentStatus: {
    rejectionReason: "",
  },
  });

  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: limitPerPage,
      ...(statusFilter && { status: statusFilter }),
    };
    dispatch(getAllPayments(queryParams));
  }, [statusFilter, currentPage, limitPerPage, dispatch]);

  // Open confirmation modal for approve
  const handleApproveClick = (payment) => {
    setConfirmationModal({
      isOpen: true,
      type: "approve",
      paymentId: payment.paymentId,
      paymentDetails: payment,
    });
  };

  // 2. handleRejectClick function ko update karein:
  const handleRejectClick = (payment) => {
    setConfirmationModal({
      isOpen: true,
      type: "reject",
      paymentId: payment.paymentId,
      paymentDetails: payment,
    });
    // Reset reject reason when opening modal
    setRejectReason("");
  };

  // 3. closeConfirmationModal function ko update karein:
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      paymentId: null,
      paymentDetails: null,
    });
    // Reset reject reason when closing modal
    setRejectReason("");
  };

  // Handle confirmed approve
  const handleConfirmedApprove = async () => {
    try {
      await dispatch(verifyPaymentById(confirmationModal.paymentId)).unwrap();

      const queryParams = {
        page: currentPage,
        limit: limitPerPage,
        ...(statusFilter && { status: statusFilter }),
      };
      dispatch(getAllPayments(queryParams));

      // Optional: Show success message
      toast.success("Payment approved successfully!");
    } catch (error) {
      console.error("Failed to approve payment:", error);
      toast.error("Failed to approve payment: " + (error.message || error));
    } finally {
      closeConfirmationModal();
    }
  };

  // 4. handleConfirmedReject function ko update karein:
  const handleConfirmedReject = async () => {
    // Validation: Reject reason is required
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      // Include rejection reason in the API call
      await dispatch(
        rejectPaymentById({
          paymentId: confirmationModal.paymentId,
          rejectionReason: rejectReason.trim(),
        })
      ).unwrap();

      const queryParams = {
        page: currentPage,
        limit: limitPerPage,
        ...(statusFilter && { status: statusFilter }),
      };
      dispatch(getAllPayments(queryParams));

      toast.success("Payment rejected successfully!");
    } catch (error) {
      console.error("Failed to reject payment:", error);
      toast.error("Failed to reject payment: " + (error.message || error));
    } finally {
      closeConfirmationModal();
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setEditFormData({
      userDetails: {
        fullName: payment.userDetails?.fullName || "",
        email: payment.userDetails?.email || "",
        phoneNumber: payment.userDetails?.phoneNumber || "",
      },
      paymentDetails: {
        paymentMethod: payment.paymentDetails?.paymentMethod || "",
        transactionId:
          payment.paymentDetails?.transactionId ||
          payment.paymentDetails?.referenceId ||
          "",
      },
      selectedPlan: {
        planId: payment.selectedPlan?.planId || "",
      },
      paymentStatus: {
      rejectionReason: payment.paymentStatus?.rejectionReason || "",
    },
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (section, field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingPayment) return;

    try {
      await dispatch(
        updatePaymentById({
          paymentId: editingPayment.paymentId,
          updatedData: editFormData,
        })
      ).unwrap();

      setIsEditModalOpen(false);
      setEditingPayment(null);

      // Refresh the payments list
      const queryParams = {
        page: currentPage,
        limit: limitPerPage,
        ...(statusFilter && { status: statusFilter }),
      };
      dispatch(getAllPayments(queryParams));

      // Optional: Show success message
      toast.success("Payment updated successfully!");
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Failed to update payment: " + (error.message || error));
    }
  };

  const handleViewReceipt = (payment) => {
    if (payment?.paymentReceipt?.fileName) {
      const fileUrl = `${process.env.REACT_APP_BACKEND}/uploads/receipts/${payment.paymentReceipt.fileName}`;
      setViewingReceipt(fileUrl);
    } else {
      toast.error("No receipt uploaded for this payment.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB") +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
      case "approved":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "rejected":
        return "text-red-400";
      case "expired":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit) => {
    setLimitPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const statusButtons = [
    { label: "All", value: "" },
    { label: "Verified", value: "verified" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
    { label: "Expired", value: "expired" },
  ];

  const paymentMethods = [
    { value: "askari", label: "Askari Bank Limited" },
  ];

  const plans = [
    { value: "weekly", label: "Weekly Plan - PKR 749" },
    { value: "monthly", label: "Monthly Plan - PKR 1,499" },
    { value: "quarterly", label: "Quarterly Plan - PKR 3,999" },
  ];

  return (
    <div className="p-6 min-h-screen text-white" style={{ background: "#0A0E27", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center space-x-2 p-4">
        <ArrowLeft className="w-5 h-5" style={{ color: "#00E5FF" }} />
        <Link
          to="/dashboard"
          className="font-medium transition-colors"
          style={{ color: "#00E5FF" }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 px-4">
        <div
          className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "#00E5FF",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          Admin Panel
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "#F8F9FA", fontFamily: "Poppins, sans-serif", letterSpacing: "-0.02em" }}
        >
          Payment Verification
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Review and approve player subscription payments
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6 flex-wrap px-4">
        {statusButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleStatusFilterChange(value)}
            className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150"
            style={{
              background: statusFilter === value
                ? "#00E5FF"
                : "rgba(0,229,255,0.08)",
              border: statusFilter === value
                ? "1px solid #00E5FF"
                : "1px solid rgba(0,229,255,0.2)",
              color: statusFilter === value ? "#0A0E27" : "#00E5FF",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Search Filter Dropdown */}
          <div className="w-full lg:w-auto">
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full lg:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
            >
              <option value="all">Search All Fields</option>
              <option value="name">Customer Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="transactionId">Transaction ID</option>
              <option value="paymentMethod">Payment Method</option>
              <option value="plan">Plan Name</option>
              <option value="rejectionReason">Rejection Reason</option>
            </select>
          </div>

          {/* Clear Search Button */}
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="w-full lg:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-300">
            <span className="text-fuchsia-300 font-medium">
              {getFilteredPayments().length}
            </span>{" "}
            result(s) found for "{searchTerm}"
            {searchFilter !== "all" && (
              <span className="text-gray-400">
                {" "}
                in{" "}
                {searchFilter === "transactionId"
                  ? "Transaction ID"
                  : searchFilter === "paymentMethod"
                  ? "Payment Method"
                  : searchFilter === "phone"
                  ? "Phone Number"
                  : searchFilter.charAt(0).toUpperCase() +
                    searchFilter.slice(1)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>Show:</span>
          <select
            value={limitPerPage}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded focus:outline-none focus:border-fuchsia-400"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {pagination && (
          <div className="text-sm text-gray-300">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-lg animate-pulse text-fuchsia-300">
          Loading payments...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full text-sm text-left border border-gray-700">
            <thead className="bg-gray-800 text-fuchsia-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-bold">Customer Details</th>
                <th className="px-4 py-3 font-bold">Plan & Amount</th>
                <th className="px-4 py-3 font-bold">Payment Method</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Rejected Reason</th>
                <th className="px-4 py-3 font-bold">Subscription</th>
                <th className="px-4 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {adminPayments && adminPayments.length > 0 ? (
                adminPayments.map((payment) => ( */}
              {getFilteredPayments() && getFilteredPayments().length > 0 ? (
                getFilteredPayments().map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
                    {/* Customer Details */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-white">
                          {payment.userDetails?.fullName || "N/A"}
                        </div>
                        <div className="text-gray-300 text-xs flex items-center">
                          <span className="mr-1">📧</span>
                          {payment.userDetails?.email || "N/A"}
                        </div>
                        <div className="text-gray-300 text-xs flex items-center">
                          <span className="mr-1">📱</span>
                          {payment.userDetails?.phoneNumber || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Plan & Amount */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-white">
                          {payment.selectedPlan?.planName || "N/A"}
                        </div>
                        <div className="font-bold text-fuchsia-300">
                          {payment.selectedPlan?.planPrice ||
                            payment.paymentDetails?.amount ||
                            "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-white">
                          {payment.paymentDetails?.paymentMethod ||
                            payment.paymentDetails?.paymentMethodName ||
                            "N/A"}
                        </div>
                        <div className="text-gray-300 text-xs">
                          ID:{" "}
                          {payment.paymentDetails?.transactionId ||
                            payment.paymentDetails?.referenceId ||
                            "N/A"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatDate(
                            payment.paymentDetails?.submissionDate ||
                              payment.createdAt
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold capitalize ${getStatusColor(
                          payment.paymentStatus?.status
                        )}`}
                      >
                        {payment.paymentStatus?.status || "N/A"}
                      </span>
                    </td>

                    {/* Rejected Reason - NEW COLUMN */}
                    <td className="px-4 py-3">
                      {payment.paymentStatus?.status === "rejected" &&
                      payment.paymentStatus?.rejectionReason ? (
                        <div className="space-y-1">
                          <div className="text-red-400 text-xs font-medium">
                            Rejection Reason:
                          </div>
                          <div className="text-gray-300 text-xs bg-red-900/20 p-2 rounded border-l-2 border-red-500">
                            {payment.paymentStatus.rejectionReason}
                          </div>
                          {payment.paymentStatus?.rejectionDate && (
                            <div className="text-gray-400 text-xs">
                              Rejected on:{" "}
                              {formatDate(payment.paymentStatus.rejectionDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs italic">
                          {payment.paymentStatus?.status === "rejected"
                            ? "No reason provided"
                            : "N/A"}
                        </div>
                      )}
                    </td>

                    {/* Subscription Details - Only show if status is verified */}
                    <td className="px-4 py-3">
                      {payment.paymentStatus?.status === "verified" ? (
                        <div className="space-y-1">
                          <div className="text-green-400 font-medium text-xs flex items-center">
                            {payment.paymentStatus?.isActive ? (
                              <>
                                <span className="mr-1">✅</span>
                                Active Subscription
                              </>
                            ) : (
                              <>
                                <span className="mr-1">⏸️</span>
                                Inactive Subscription
                              </>
                            )}
                          </div>
                          <div className="text-gray-300 text-xs">
                            <div className="flex items-center">
                              <span className="mr-1">🚀</span>
                              Start:{" "}
                              {formatDate(
                                payment.paymentStatus?.subscriptionStartDate
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="mr-1">⏰</span>
                              End:{" "}
                              {formatDate(
                                payment.paymentStatus?.subscriptionEndDate
                              )}
                            </div>
                          </div>
                          {/* Days remaining indicator */}
                          <div className="text-xs">
                            {(() => {
                              const endDate = new Date(
                                payment.paymentStatus?.subscriptionEndDate
                              );
                              const today = new Date();
                              const daysLeft = Math.ceil(
                                (endDate - today) / (1000 * 60 * 60 * 24)
                              );
                              return (
                                <span
                                  className={`${
                                    daysLeft > 7
                                      ? "text-green-400"
                                      : daysLeft > 0
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : "Expired"}
                                </span>
                              );
                            })()}
                          </div>
                          {/* Expiry Date */}
                          <div className="text-gray-400 text-xs mt-1">
                            <span className="mr-1">📅</span>
                            Expires:{" "}
                            {formatDate(payment.paymentStatus?.expiryDate)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs">
                          <span className="italic">
                            {payment.paymentStatus?.status === "pending"
                              ? "Awaiting approval"
                              : "No subscription"}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs transition-colors"
                        >
                          View Receipt
                        </button>

                        {payment.paymentStatus?.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveClick(payment)}
                              className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-bold transition-colors"
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleRejectClick(payment)}
                              className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-bold transition-colors"
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Reject"}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleEdit(payment)}
                          className="px-2 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-xs transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    {/* =============== CHANGE THIS SECTION =============== */}
                    {searchTerm ? (
                      <div className="space-y-2">
                        <p>No payments found matching your search criteria</p>
                        <button
                          onClick={handleClearSearch}
                          className="text-fuchsia-400 hover:text-fuchsia-300 underline text-sm"
                        >
                          Clear search to show all payments
                        </button>
                      </div>
                    ) : (
                      "No payments found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pagination.hasPrevPage
                ? "bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600"
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNumber;

              if (pagination.totalPages <= 5) {
                pageNumber = i + 1;
              } else {
                // Show pages around current page
                const start = Math.max(1, pagination.currentPage - 2);
                const end = Math.min(pagination.totalPages, start + 4);
                const adjustedStart = Math.max(1, end - 4);
                pageNumber = adjustedStart + i;
              }

              if (pageNumber > pagination.totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    pagination.currentPage === pageNumber
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-gray-700 text-white hover:bg-fuchsia-600 border-gray-600"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          {/* Show ellipsis if needed */}
          {pagination.totalPages > 5 &&
            pagination.currentPage < pagination.totalPages - 2 && (
              <>
                <span className="text-gray-400 px-2">...</span>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600 transition-colors"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pagination.hasNextPage
                ? "bg-gray-700 text-white hover:bg-fuchsia-600 border border-gray-600"
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal for Approve/Reject */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Header */}
              <div className="flex items-center mb-3 sm:mb-4">
                {confirmationModal.type === "approve" ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Approve Payment
                    </h3>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Reject Payment
                    </h3>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Are you sure you want to {confirmationModal.type} this
                  payment?
                </p>

                {/* Payment Details */}
                {confirmationModal.paymentDetails && (
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg space-y-2 mb-3 sm:mb-4">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Customer:
                      </span>
                      <span className="text-white font-medium text-xs sm:text-sm text-right max-w-[60%] break-words">
                        {confirmationModal.paymentDetails.userDetails
                          ?.fullName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Plan:
                      </span>
                      <span className="text-white text-xs sm:text-sm text-right max-w-[60%] break-words">
                        {confirmationModal.paymentDetails.selectedPlan
                          ?.planName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Amount:
                      </span>
                      <span className="text-fuchsia-300 font-bold text-xs sm:text-sm text-right">
                        {confirmationModal.paymentDetails.selectedPlan
                          ?.planPrice ||
                          confirmationModal.paymentDetails.paymentDetails
                            ?.amount ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        Transaction ID:
                      </span>
                      <span className="text-white text-xs sm:text-sm text-right max-w-[60%] break-all">
                        {confirmationModal.paymentDetails.paymentDetails
                          ?.transactionId ||
                          confirmationModal.paymentDetails.paymentDetails
                            ?.referenceId ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rejection Reason Input - Only show for reject */}
                {confirmationModal.type === "reject" && (
                  <>
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Reason for Rejection{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejecting this payment..."
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none text-xs sm:text-sm"
                        rows="3"
                        maxLength="500"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {rejectReason.length}/500 characters
                      </div>
                    </div>

                    {/* Quick Select Reasons - Only for reject */}
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Quick Select Reason:
                      </label>
                      <div className="grid grid-cols-1 gap-1 sm:gap-2 max-h-32 sm:max-h-40 overflow-y-auto">
                        {[
                          "Invalid transaction ID",
                          "Insufficient payment amount",
                          "Fake receipt uploaded",
                          "Payment method mismatch",
                          "Duplicate payment request",
                          "Account information mismatch",
                        ].map((reason) => (
                          <button
                            key={reason}
                            onClick={() => setRejectReason(reason)}
                            className="text-left px-2 sm:px-3 py-1 sm:py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs sm:text-sm transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={closeConfirmationModal}
                  className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={
                    confirmationModal.type === "approve"
                      ? handleConfirmedApprove
                      : handleConfirmedReject
                  }
                  className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base order-1 sm:order-2 ${
                    confirmationModal.type === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  disabled={
                    loading ||
                    (confirmationModal.type === "reject" &&
                      !rejectReason.trim())
                  }
                >
                  {loading
                    ? "Processing..."
                    : confirmationModal.type === "approve"
                    ? "Approve"
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-fuchsia-400">
                  Edit Payment
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Customer Details Section */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.userDetails.fullName}
                        onChange={(e) =>
                          handleEditFormChange(
                            "userDetails",
                            "fullName",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editFormData.userDetails.email}
                        onChange={(e) =>
                          handleEditFormChange(
                            "userDetails",
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.userDetails.phoneNumber}
                        onChange={(e) =>
                          handleEditFormChange(
                            "userDetails",
                            "phoneNumber",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={editFormData.paymentDetails.paymentMethod}
                        onChange={(e) =>
                          handleEditFormChange(
                            "paymentDetails",
                            "paymentMethod",
                            e.target.value
                          )
                        }
                        disabled={true}
                        className="w-full px-3 py-2 bg-gray-500 border border-gray-500 rounded-md text-gray-300 cursor-not-allowed opacity-60"
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-400 mt-1">
                        💡 Payment method cannot be changed (Only Askari Bank Limited is supported)
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        value={editFormData.paymentDetails.transactionId}
                        onChange={(e) =>
                          handleEditFormChange(
                            "paymentDetails",
                            "transactionId",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan Section */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
                    Subscription Plan
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Plan
                    </label>
                    <select
                      value={editFormData.selectedPlan.planId}
                      onChange={(e) =>
                        handleEditFormChange(
                          "selectedPlan",
                          "planId",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:border-fuchsia-400"
                    >
                      <option value="">Select Plan</option>
                      {plans.map((plan) => (
                        <option key={plan.value} value={plan.value}>
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Status Section - ADD THIS NEW SECTION */}
<div className="bg-gray-700 p-4 rounded-lg">
  <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
    Payment Status
  </h3>
  
  {/* Show current status */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      Current Status
    </label>
    <div className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md">
      <span
        className={`font-bold capitalize ${getStatusColor(
          editingPayment?.paymentStatus?.status
        )}`}
      >
        {editingPayment?.paymentStatus?.status || "N/A"}
      </span>
    </div>
  </div>

  {/* Rejection Reason - Show for all payments but make it editable */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      Rejection Reason
      {editingPayment?.paymentStatus?.status === "rejected" && (
        <span className="text-red-400 ml-1">*</span>
      )}
    </label>
    <textarea
      value={editFormData.paymentStatus.rejectionReason}
      onChange={(e) =>
        handleEditFormChange(
          "paymentStatus",
          "rejectionReason",
          e.target.value
        )
      }
      placeholder={
        editingPayment?.paymentStatus?.status === "rejected"
          ? "Enter rejection reason..."
          : "Add rejection reason (optional)"
      }
      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 resize-none"
      rows="3"
      maxLength="500"
    />
    <div className="text-xs text-gray-400 mt-1">
      {editFormData.paymentStatus.rejectionReason.length}/500 characters
    </div>
    
    {/* Show warning for rejected payments */}
    {editingPayment?.paymentStatus?.status === "rejected" && (
      <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-500">
        ⚠️ This payment is currently rejected. You can update the rejection reason here.
      </div>
    )}
    
    {/* Show info for non-rejected payments */}
    {editingPayment?.paymentStatus?.status !== "rejected" && (
      <div className="mt-2 text-xs text-gray-400">
        💡 You can add a rejection reason here for future reference, but it won't change the payment status.
      </div>
    )}
  </div>
</div>

                {/* Current Payment Info */}
                {editingPayment && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-fuchsia-300 mb-3 sm:mb-4">
                      Current Payment Info
                    </h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        <span className="font-medium">Payment ID:</span>{" "}
                        {editingPayment.paymentId}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 font-bold capitalize ${getStatusColor(
                            editingPayment.paymentStatus?.status
                          )}`}
                        >
                          {editingPayment.paymentStatus?.status}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(editingPayment.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 mt-5 sm:mt-6 pt-4 border-t border-gray-600">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors font-semibold"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-4 max-w-2xl w-full shadow-2xl">
            <img
              src={viewingReceipt}
              alt="Receipt"
              className="rounded-lg w-full max-h-[80vh] object-contain"
            />
            <div className="text-right mt-4">
              <button
                onClick={() => setViewingReceipt(null)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerificationPanel;
