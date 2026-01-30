import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RAZORPAY_KEY_ID } from "../../config";
import { createRazorpayOrder, verifyPayment, getBookingById, updateBookingStatus } from "../../api/bookingApi";
import { getPassengersByBooking } from "../../api/passengerApi";
import Loader from "../../components/Loader";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await getBookingById(bookingId);
        setBooking(bookingRes.data);

        const passengerRes = await getPassengersByBooking(bookingId);
        setPassengers(passengerRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load booking details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [bookingId]);

  const handlePaymentClick = async () => {
    if (!booking) return;

    setProcessingPayment(true);
    setError(null);

    try {
      // Step 1: Create Razorpay Order
      const orderResponse = await createRazorpayOrder(bookingId, booking.totalAmount);

      const { orderId, amount, currency } = orderResponse.data;

      // Handle BOTH flat and nested customer/tour structures
      const customerName = booking.customerName || booking.customer?.name || "";
      const customerEmail = booking.customerEmail || booking.customer?.email || "";
      const customerMobile = booking.customerMobile || booking.customer?.mobileNumber || "";

      // Validate that we have required fields
      if (!orderId || !amount) {
        setError("Missing required payment information. Please refresh and try again.");
        setProcessingPayment(false);
        return;
      }

      // Validate customer data exists
      if (!customerName || !customerEmail) {
        setError("Customer information is incomplete. Please refresh and try again.");
        setProcessingPayment(false);
        return;
      }

      // Step 2: Prepare Razorpay Options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount, // Already in paise from backend
        currency: currency,
        order_id: orderId,
        name: "E-Tour",
        description: `Booking #${bookingId}`,
        image: "https://your-logo-url.com/logo.png", // Replace with actual logo if available
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerMobile,
        },
        theme: {
          color: "#059669", // Emerald-600 to match theme
        },
        handler: (response) => {
          verifyPaymentWithBackend(response);
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            updateBookingStatus(bookingId, 'FAILED');
            setError("Payment was cancelled");
          },
        },
      };

      // Step 4: Open Razorpay Checkout
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError("Razorpay SDK not loaded");
        setProcessingPayment(false);
      }
    } catch (err) {
      updateBookingStatus(bookingId, 'FAILED');
      setError(err.response?.data?.message || "Failed to initiate payment");
      setProcessingPayment(false);
      console.error("Payment Error:", err);
    }
  };

  const verifyPaymentWithBackend = async (razorpayResponse) => {
    try {
      // Call backend to verify payment
      await verifyPayment({
        bookingId: bookingId,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });

      // Payment verified successfully
      setProcessingPayment(false);
      navigate(`/payment/success/${bookingId}`);
    } catch (err) {
      updateBookingStatus(bookingId, 'FAILED');
      setProcessingPayment(false);
      setError(err.response?.data?.message || "Payment verification failed");
      console.error(err);
      navigate(`/payment/failure`, { state: { error: err.response?.data?.message } });
    }
  };

  if (loading) return <Loader />;

  if (!booking) return <div className="text-center p-12 text-gray-500">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your booking securely</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Payment Method & Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Review Passengers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                Travellers
              </h2>
              <div className="space-y-3 pl-10">
                {passengers.map((passenger, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="bg-gray-200 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="font-medium">{passenger.passengerName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Payment Method
              </h2>

              <div className="pl-10">
                <div className="border border-emerald-500 bg-emerald-50 rounded-xl p-4 flex items-center justify-between cursor-pointer shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-8 w-8" />
                    <div>
                      <p className="font-bold text-gray-900">Razorpay Secure</p>
                      <p className="text-sm text-gray-600">Cards, UPI, NetBanking, Wallets</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-600"></div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Your payment is encrypted and authenticated securely.
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Booking ID</span>
                  <span className="font-mono font-bold text-gray-800">#{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-4"></div>
                <div className="flex justify-between">
                  <span>{passengers.length === 1 ? 'Tour Cost (Single Occupancy)' : 'Tour Cost'}</span>
                  <span className="font-medium">₹ {booking.tourAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="font-medium">₹ {booking.taxAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-6">
                <span className="font-bold text-gray-700">Total Payable</span>
                <span className="font-bold text-2xl text-emerald-600">₹{booking.totalAmount?.toFixed(2)}</span>
              </div>

              {/* Pricing Explanation */}
              {passengers.length === 1 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
                  <p className="font-bold mb-1">Why is the price higher?</p>
                  <p>You have booked for 1 person (Single Occupancy). The standard price is based on Twin Sharing. A supplement is added for the exclusive use of a double room.</p>
                </div>
              )}

              <button
                onClick={handlePaymentClick}
                disabled={processingPayment}
                className={`
                            w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all
                            ${processingPayment ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30'}
                        `}
              >
                {processingPayment ? 'Processing...' : `Pay Now`}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>

        </div>
      </div>
    </div >
  );
};

export default PaymentPage;
