import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookingById, downloadInvoice, resendInvoiceEmail } from "../api/bookingApi";
import { getPassengersByBooking } from "../api/passengerApi";
import Loader from "../components/Loader";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await downloadInvoice(bookingId);

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setDownloading(false);
    } catch (err) {
      setError("Failed to download invoice. Invoice may not be available yet.");
      setDownloading(false);
      console.error(err);
    }
  };

  const handleResendInvoice = async () => {
    setResending(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await resendInvoiceEmail(bookingId);
      setSuccessMessage("Invoice has been resent to your email!");
      setResending(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend invoice");
      setResending(false);
      console.error(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Failed to load booking details</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isBookingConfirmed = booking.bookingStatus === "CONFIRMED";
  const statusColor = isBookingConfirmed ? "text-green-600" : "text-yellow-600";
  const statusBgColor = isBookingConfirmed ? "bg-green-50" : "bg-yellow-50";
  const statusBorderColor = isBookingConfirmed ? "border-green-200" : "border-yellow-200";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
          <p className="text-gray-600 mt-2">Booking #{bookingId}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            ✓ {successMessage}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Booking Status */}
          <div className={`${statusBgColor} border ${statusBorderColor} rounded-lg p-4`}>
            <p className="text-sm text-gray-600">Booking Status</p>
            <p className={`text-2xl font-bold ${statusColor}`}>
              {booking.bookingStatus}
            </p>
          </div>

          {/* Booking Date */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Booking Date</p>
            <p className="text-2xl font-bold text-blue-600">
              {booking.bookingDate}
            </p>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Tour Information */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">
            Tour Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tour</p>
              <p className="text-gray-800 font-semibold">
                {booking.tourDescription}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="text-gray-800 font-semibold">
                {booking.tourCategoryName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Departure Date</p>
              <p className="text-gray-800 font-semibold">
                {booking.departureDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">End Date</p>
              <p className="text-gray-800 font-semibold">
                {booking.endDate}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-gray-800 font-semibold">
                {booking.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-gray-800 font-semibold">
                {booking.customerEmail}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-gray-800 font-semibold">
                {booking.customerMobile}
              </p>
            </div>
          </div>

          {/* Passengers */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">
            Passengers ({passengers.length})
          </h2>
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {passengers.map((passenger, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <p className="text-sm text-gray-600">
                    Passenger {idx + 1}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {passenger.passengerName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Breakdown */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Payment Summary
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
              <span className="text-gray-700">Tour Amount:</span>
              <span className="font-semibold text-gray-800">
                ₹{booking.tourAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-gray-300">
              <span className="text-gray-700">Tax (5%):</span>
              <span className="font-semibold text-gray-800">
                ₹{booking.taxAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-800">Total Amount:</span>
              <span className="font-bold text-blue-600">
                ₹{booking.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isBookingConfirmed && (
          <div className="space-y-3 mb-6">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition ${
                downloading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {downloading ? "Downloading..." : "📥 Download Invoice"}
            </button>

            <button
              onClick={handleResendInvoice}
              disabled={resending}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition ${
                resending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
              }`}
            >
              {resending ? "Sending..." : "📧 Resend Invoice to Email"}
            </button>
          </div>
        )}

        {/* Info Box */}
        {isBookingConfirmed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              <span className="font-semibold">✓ Booking Confirmed</span> - Your
              tour is booked and payment has been received. A confirmation
              email has been sent to {booking.customer?.email}
            </p>
          </div>
        )}

        {!isBookingConfirmed && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">⏳ Pending Payment</span> - Your
              booking is waiting for payment confirmation. Please complete the
              payment to confirm your tour.
            </p>
            <button
              onClick={() => navigate(`/payment/${bookingId}`)}
              className="mt-3 w-full py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
