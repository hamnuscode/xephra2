import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  History,
  User,
  Mail,
  Phone,
  Hash,
  Building,
  Receipt,
  FileImage,
} from "lucide-react";
import { getCategorizedUserSubscriptions, deletePendingSubscriptionByPaymentId } from "../../../redux/features/paymentSlice"; // Update path as needed

const SubscriptionPopup = ({ isOpen, onClose, userId }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("current");
  const [editingId, setEditingId] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

  // Redux state
  const { categorizedSubscriptions, loading, error, successMessage } = useSelector(
    (state) => state.payment
  ); // Adjust 'payment' to your slice name

  // Destructure categorized subscriptions with fallbacks
  const {
    active = [],
    expired = [],
    pending = [],
    rejected = [],
    total = 0,
  } = categorizedSubscriptions;

  // Get current active subscription (first active one)
  const currentSubscription = active.length > 0 ? active[0] : null;

  const fetchSubscriptions = async () => {
    if (!userId) return;
    dispatch(getCategorizedUserSubscriptions(userId));
  };

const handleDelete = (paymentId) => {
  const subscription = pending.find(sub => sub.paymentId === paymentId);
  setSubscriptionToDelete(subscription);
  setDeleteModalOpen(true);
};

const confirmDelete = async () => { 
  if (!subscriptionToDelete) return;
  
  setIsDeleting(true);
  try {
    // Redux action dispatch karein
    const result = await dispatch(deletePendingSubscriptionByPaymentId(subscriptionToDelete.paymentId));
    
    if (deletePendingSubscriptionByPaymentId.fulfilled.match(result)) {
      // Success ke baad:
      setDeleteModalOpen(false);
      setSubscriptionToDelete(null);
      fetchSubscriptions(); // Data refresh karein
    } else {
      // Error handle karein - silent failure
    }
    
  } catch (error) {
    // Handle error silently
  } finally {
    setIsDeleting(false);
  }
};

// useEffect add karein existing useEffect ke baad:
useEffect(() => {
  if (successMessage && successMessage.includes('deleted')) {
    // Success message show karein (toast ya alert)
    // Agar toast library use kar rahe hain:
    // toast.success(successMessage);
  }
}, [successMessage]);

  const formatAmount = (amount, currency = "PKR") =>
    `${currency} ${amount.toLocaleString()}`;

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "expired":
        return <History className="w-4 h-4 text-gray-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "verified":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchSubscriptions();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // New function for date-only formatting (for current subscription)
  function formatDateOnly(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const handleImageClick = (fileName) => {
    const url = `${process.env.REACT_APP_BACKEND}/uploads/receipts/${fileName}`;
    setModalImageUrl(url);
    setImageModalOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">My Subscriptions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {["current", "expired", "pending", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "current" && `Current Plan (${active.length})`}
              {tab === "expired" && `Expired (${expired.length})`}
              {tab === "pending" && `Pending (${pending.length})`}
              {tab === "rejected" && `Rejected (${rejected.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading subscriptions...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Error Loading Subscriptions</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchSubscriptions}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {activeTab === "current" &&
                (currentSubscription ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon("active")}
                          <h3 className="font-semibold text-lg text-gray-800">
                            {currentSubscription.selectedPlan?.planName}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {currentSubscription.paymentStatus?.status?.toUpperCase() ||
                              "ACTIVE"}
                          </span>
                        </div>
                        {currentSubscription.selectedPlan?.planDuration && (
                          <div className="mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              <Calendar className="w-4 h-4" />
                              Duration:{" "}
                              {currentSubscription.selectedPlan.planDuration}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {currentSubscription.selectedPlan?.planPrice}
                          </div>
                          {currentSubscription.paymentStatus
                            ?.verificationDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Verified:{" "}
                              {formatDate(
                                currentSubscription.paymentStatus
                                  .verificationDate
                              )}
                            </div>
                          )}
                          {currentSubscription.paymentStatus
                            ?.subscriptionStartDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Started:{" "}
                              {formatDateOnly(
                                currentSubscription.paymentStatus.subscriptionStartDate
                              )}
                            </div>
                          )}
                          {currentSubscription.paymentStatus
                            ?.subscriptionEndDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Ended:{" "}
                              {formatDateOnly(
                                currentSubscription.paymentStatus.subscriptionEndDate
                              )}
                            </div>
                          )}
                        </div>

                        {/* Additional Payment Details */}
                        <div className="mt-4 pt-4 border-t border-green-200">
                          <h4 className="text-sm font-medium text-gray-800 mb-3">
                            Payment Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            {currentSubscription.userDetails?.fullName && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span className="truncate">
                                  {currentSubscription.userDetails.fullName}
                                </span>
                              </div>
                            )}
                            {currentSubscription.userDetails?.email && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">
                                  {currentSubscription.userDetails.email}
                                </span>
                              </div>
                            )}
                            {currentSubscription.userDetails?.phoneNumber && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                {currentSubscription.userDetails.phoneNumber}
                              </div>
                            )}
                            {currentSubscription.paymentDetails?.transactionId && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Hash className="w-4 h-4" />
                                Transaction ID: {currentSubscription.paymentDetails.transactionId}
                              </div>
                            )}
                            {currentSubscription.paymentDetails?.paymentMethod && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building className="w-4 h-4" />
                                Method: {currentSubscription.paymentDetails.paymentMethod}
                              </div>
                            )}
                            {currentSubscription.paymentReceipt?.fileName && (
                              <button
                                onClick={() =>
                                  handleImageClick(
                                    currentSubscription.paymentReceipt.fileName.replace(
                                      /['",]/g,
                                      ""
                                    )
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                              >
                                <FileImage className="w-3 h-3" />
                                Payment Receipt
                              </button>
                            )}
                            {currentSubscription?.paymentId && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Hash className="w-4 h-4" />
                                 Payment ID: {currentSubscription.paymentId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      No Active Subscription
                    </p>
                    <p className="text-sm mt-2">
                      You currently don't have any active subscription plan.
                    </p>
                  </div>
                ))}

              {activeTab === "pending" && (
                <div className="space-y-4">
                  {pending.map((sub) => (
                    <div
                      key={sub.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-yellow-50 border-yellow-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusIcon(
                              sub.paymentStatus?.status || sub.status
                            )}
                            <h3 className="font-semibold text-lg text-gray-800">
                              {sub.selectedPlan?.planName}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                sub.paymentStatus?.status || sub.status
                              )}`}
                            >
                              {(
                                sub.paymentStatus?.status || sub.status
                              )?.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              {sub.selectedPlan?.planPrice}
                            </div>
                            {sub.paymentStatus?.submissionDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Submitted:{" "}
                                {formatDate(sub.paymentStatus.submissionDate)}
                              </div>
                            )}
                          </div>

                          {/* Additional Payment Details */}
                          <div className="mt-3 pt-3 border-t border-yellow-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-600">
                              {sub.userDetails?.fullName && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">
                                    {sub.userDetails?.fullName}
                                  </span>
                                </div>
                              )}
                              {sub.userDetails?.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">
                                    {sub.userDetails.email}
                                  </span>
                                </div>
                              )}
                              {sub.userDetails?.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {sub.userDetails.phoneNumber}
                                </div>
                              )}
                              {sub.paymentDetails?.transactionId && (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-3 h-3" />
                                  Transaction ID:{" "}
                                  {sub.paymentDetails.transactionId}
                                </div>
                              )}
                              {sub.paymentDetails?.paymentMethod && (
                                <div className="flex items-center gap-2">
                                  <Building className="w-3 h-3" />
                                  Method: {sub.paymentDetails.paymentMethod}
                                </div>
                              )}
                              {sub.paymentReceipt?.fileName && (
                              <button
                                onClick={() =>
                                  handleImageClick(
                                    sub.paymentReceipt.fileName.replace(
                                      /['",]/g,
                                      ""
                                    )
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                              >
                                <FileImage className="w-3 h-3" />
                                Payment Receipt
                              </button>
                            )}
                              {sub.selectedPlan?.planDuration && (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-3 h-3" />
                                  Duration: {sub.selectedPlan?.planDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {/* <button
                            onClick={() => setEditingId(sub.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button> */}
                          <button
                            onClick={() => handleDelete(sub.paymentId)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pending.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No Pending Requests</p>
                      <p className="text-sm mt-2">
                        Your pending subscriptions will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "rejected" && (
                <div className="space-y-4">
                  {rejected.map((sub) => (
                    <div
                      key={sub.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-red-50 border-red-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusIcon(
                              sub.paymentStatus?.status || sub.status
                            )}
                            <h3 className="font-semibold text-lg text-gray-800">
                              {sub.selectedPlan?.planName}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                sub.paymentStatus?.status || sub.status
                              )}`}
                            >
                              {(
                                sub.paymentStatus?.status || sub.status
                              )?.toUpperCase()}
                            </span>
                          </div>
                          {sub.paymentStatus?.status === "rejected" &&
                            sub.paymentStatus?.rejectionReason && (
                              <div className="mb-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800 font-medium mb-1">
                                  Rejection Reason:
                                </p>
                                <p className="text-sm text-red-700">
                                  {sub.paymentStatus.rejectionReason}
                                </p>
                              </div>
                            )}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              {sub.selectedPlan?.planPrice}
                            </div>
                            {sub.paymentStatus?.submissionDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Submitted:{" "}
                                {formatDate(sub.paymentStatus.submissionDate)}
                              </div>
                            )}
                          </div>

                          {/* Additional Payment Details */}
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-600">
                              {sub.userDetails?.fullName && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">
                                    {sub.userDetails?.fullName}
                                  </span>
                                </div>
                              )}
                              {sub.userDetails?.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">
                                    {sub.userDetails.email}
                                  </span>
                                </div>
                              )}
                              {sub.userDetails?.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {sub.userDetails.phoneNumber}
                                </div>
                              )}
                              {sub.paymentDetails?.transactionId && (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-3 h-3" />
                                  Transaction ID:{" "}
                                  {sub.paymentDetails.transactionId}
                                </div>
                              )}
                              {sub.paymentDetails?.paymentMethod && (
                                <div className="flex items-center gap-2">
                                  <Building className="w-3 h-3" />
                                  Method: {sub.paymentDetails.paymentMethod}
                                </div>
                              )}
                              {sub.paymentReceipt?.fileName && (
                              <button
                                onClick={() =>
                                  handleImageClick(
                                    sub.paymentReceipt.fileName.replace(
                                      /['",]/g,
                                      ""
                                    )
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                              >
                                <FileImage className="w-3 h-3" />
                                Payment Receipt
                              </button>
                            )}
                              {sub.selectedPlan?.planDuration && (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-3 h-3" />
                                  Duration: {sub.selectedPlan?.planDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* No action buttons for rejected subscriptions */}
                      </div>
                    </div>
                  ))}
                  {rejected.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No Rejected Requests
                      </p>
                      <p className="text-sm mt-2">
                        Your rejected subscriptions will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "expired" && (
                <div className="space-y-4">
                  {expired.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No Expired Subscriptions
                      </p>
                      <p className="text-sm mt-2">
                        Your expired subscriptions will appear here.
                      </p>
                    </div>
                  ) : (
                    expired.map((sub) => (
                      <div
                        key={sub.id}
                        className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon("expired")}
                          <h3 className="font-semibold text-lg text-gray-800">
                            {sub.selectedPlan?.planName}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            EXPIRED
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {sub.selectedPlan?.planPrice}
                          </div>
                          {sub.paymentStatus?.submissionDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Started:{" "}
                              {formatDate(sub.paymentStatus.submissionDate)}
                            </div>
                          )}
                        </div>

                        {/* Additional Payment Details */}
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-600">
                            {sub.userDetails?.fullName && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">
                                  {sub.userDetails?.fullName}
                                </span>
                              </div>
                            )}
                            {sub.userDetails?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">
                                  {sub.userDetails.email}
                                </span>
                              </div>
                            )}
                            {sub.userDetails?.phoneNumber && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {sub.userDetails.phoneNumber}
                              </div>
                            )}
                            {sub.paymentDetails?.transactionId && (
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3" />
                                Transaction ID:{" "}
                                {sub.paymentDetails.transactionId}
                              </div>
                            )}
                            {sub.paymentMethod && (
                              <div className="flex items-center gap-2">
                                <Building className="w-3 h-3" />
                                Method: {sub.paymentMethod}
                              </div>
                            )}
                            {sub.paymentReceipt?.fileName && (
                              <button
                                onClick={() =>
                                  handleImageClick(
                                    sub.paymentReceipt.fileName.replace(
                                      /['",]/g,
                                      ""
                                    )
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                              >
                                <FileImage className="w-3 h-3" />
                                Payment Receipt
                              </button>
                            )}
                            {sub.selectedPlan?.planDuration && (
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3" />
                                Duration: {sub.selectedPlan?.planDuration}
                              </div>
                            )}
                            {sub.paymentId && (
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3" />
                                Payment ID: {sub.paymentId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>
            Current: {active.length} | Expired: {expired.length} | Pending:{" "}
            {pending.length} | Rejected: {rejected.length} | Total: {total}
          </span>
          <button
            onClick={fetchSubscriptions}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>

        {imageModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fadeInUp">
              {/* Close Button */}
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 bg-white rounded-full p-1 shadow"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Display */}
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                  Payment Receipt
                </h2>
                <img
                  src={modalImageUrl}
                  alt="Payment Receipt"
                  className="w-full max-h-[70vh] object-contain rounded-lg border"
                />
              </div>
            </div>
          </div>
        )}


        {/* Delete Confirmation Modal */}
        {/* {deleteModalOpen && subscriptionToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
    
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Subscription
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setSubscriptionToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

           
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">
                    Are you sure you want to delete this subscription request? This action cannot be undone.
                  </p>
                  
             
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Subscription Details:
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Plan:</span> {subscriptionToDelete.selectedPlan?.planName}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> {subscriptionToDelete.selectedPlan?.planPrice}
                      </div>
                      {subscriptionToDelete.selectedPlan?.planDuration && (
                        <div>
                          <span className="font-medium">Duration:</span> {subscriptionToDelete.selectedPlan.planDuration}
                        </div>
                      )}
                      {subscriptionToDelete.paymentStatus?.submissionDate && (
                        <div>
                          <span className="font-medium">Submitted:</span> {formatDate(subscriptionToDelete.paymentStatus.submissionDate)}
                        </div>
                      )}
                      {subscriptionToDelete.paymentId && (
                        <div>
                          <span className="font-medium">Payment ID:</span> {subscriptionToDelete.paymentId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Warning:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>This will permanently delete your subscription request</li>
                        <li>You will need to resubmit if you want to subscribe later</li>
                        <li>Any uploaded payment receipt will also be removed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

    
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setSubscriptionToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Subscription
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )} */}


       {/* Delete Confirmation Modal - Fully Responsive */}
{deleteModalOpen && subscriptionToDelete && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg overflow-hidden max-h-[95vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 bg-red-100 rounded-full flex-shrink-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            Delete Subscription
          </h3>
        </div>
        <button
          onClick={() => {
            setDeleteModalOpen(false);
            setSubscriptionToDelete(null);
          }}
          disabled={isDeleting}
          className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        <div className="mb-4">
          <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
            Are you sure you want to delete this subscription request? This action cannot be undone.
          </p>
          
          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border">
            <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2">
              Subscription Details:
            </h4>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Plan:</span> 
                <span className="ml-1 break-words">
                  {subscriptionToDelete.selectedPlan?.planName}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Price:</span> 
                <span className="ml-1">
                  {subscriptionToDelete.selectedPlan?.planPrice}
                </span>
              </div>
              {subscriptionToDelete.selectedPlan?.planDuration && (
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Duration:</span> 
                  <span className="ml-1">
                    {subscriptionToDelete.selectedPlan.planDuration}
                  </span>
                </div>
              )}
              {subscriptionToDelete.paymentStatus?.submissionDate && (
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Submitted:</span> 
                  <span className="ml-1 break-words">
                    {formatDate(subscriptionToDelete.paymentStatus.submissionDate)}
                  </span>
                </div>
              )}
              {subscriptionToDelete.paymentId && (
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Payment ID:</span> 
                  <span className="ml-1 break-all">
                    {subscriptionToDelete.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-red-800 min-w-0 flex-1">
              <p className="font-medium mb-1">Warning:</p>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs leading-relaxed">
                <li>This will permanently delete your subscription request</li>
                <li>You will need to resubmit if you want to subscribe later</li>
                <li>Any uploaded payment receipt will also be removed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <button
          onClick={() => {
            setDeleteModalOpen(false);
            setSubscriptionToDelete(null);
          }}
          disabled={isDeleting}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          disabled={isDeleting}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete Subscription</span>
              <span className="sm:hidden">Delete</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default SubscriptionPopup;
