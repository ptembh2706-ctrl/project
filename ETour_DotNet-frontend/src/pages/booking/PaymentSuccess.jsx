import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookingById, downloadInvoice, resendInvoiceEmail } from "../../api/bookingApi";
import { getPassengersByBooking } from "../../api/passengerApi";
import Loader from "../../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentSuccess = () => {

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, passengerRes] = await Promise.all([
          getBookingById(bookingId),
          getPassengersByBooking(bookingId)
        ]);
        setBooking(bookingRes.data);
        setPassengers(passengerRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load details", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      const response = await downloadInvoice(bookingId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice downloaded!");
    } catch (err) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  const handleResendInvoice = async () => {
    setResending(true);
    try {
      await resendInvoiceEmail(bookingId);
      toast.success("Invoice sent to email!");
    } catch (err) {
      toast.error("Failed to resend invoice");
    } finally {
      setResending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  if (!booking) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-red-500 text-xl font-semibold mb-4">Book not found or error loading details.</div>
      <button onClick={() => navigate("/")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Return Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">

          {/* Header Banner */}
          <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
              <p className="text-emerald-100">Thank you for booking with E-Tour. Your adventure awaits.</p>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
              <div className="absolute top-20 right-10 w-20 h-20 bg-white rounded-full mix-blend-overlay"></div>
            </div>
          </div>

          <div className="p-8">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Actions & Status */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-emerald-800 font-bold mb-1">Booking Status</h3>
                  <p className="text-2xl font-bold text-emerald-600 mb-4">{booking.bookingStatus}</p>
                  <div className="text-sm text-emerald-700 space-y-2">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Confirmation sent to {booking.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-blue-800 font-bold mb-4">Manage Booking</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={downloading}
                      className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-200 py-2 px-4 rounded-xl font-semibold hover:bg-blue-50 transition"
                    >
                      {downloading ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                      Download Invoice
                    </button>
                    <button
                      onClick={handleResendInvoice}
                      disabled={resending}
                      className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-200 py-2 px-4 rounded-xl font-semibold hover:bg-blue-50 transition"
                    >
                      {resending ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                      Email Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-2 space-y-8">

                {/* Summary Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Booking Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Tour Name</p>
                      <p className="font-semibold text-gray-900 text-lg">{booking.tourCategoryName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Booking ID</p>
                      <p className="font-mono font-semibold text-gray-900 text-lg">#{bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Departure</p>
                      <p className="font-semibold text-gray-900">{booking.departureDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                      <p className="font-semibold text-gray-900">{booking.numberOfDays} Days</p>
                    </div>
                  </div>
                </div>

                {/* Passengers Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Passenger List</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {passengers.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{p.passengerName}</span>
                            {p.gender && (
                              <span className="text-xs text-gray-400">({p.gender})</span>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.passengerType === 'ADULT' ? 'bg-emerald-100 text-emerald-700' :
                              p.passengerType === 'INFANT' ? 'bg-purple-100 text-purple-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {p.passengerType?.replace(/_/g, ' ') || 'ADULT'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 mt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    Need help? <a href="/about" className="text-emerald-600 font-semibold hover:underline">Contact Support</a>
                  </div>
                  <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Explorer More Tours
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
