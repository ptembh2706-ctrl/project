import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookingById } from "../../api/bookingApi";
import { getPassengersByBooking } from "../../api/passengerApi";

const BookingSummary = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBookingById(bookingId),
      getPassengersByBooking(bookingId)
    ]).then(([bookingRes, passengerRes]) => {
      setBooking(bookingRes.data);
      setPassengers(passengerRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [bookingId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  if (!booking) return <div className="p-8 text-center text-red-500">Booking details not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Booking</h1>
          <p className="text-gray-500 mt-2">Please check all details before proceeding to payment.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* 1. Tour & Date Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
              <h2 className="font-bold text-emerald-800 text-lg">Tour Information</h2>
              <span className="bg-white text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wide">
                Booking #{bookingId}
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Tour Name</p>
                <p className="text-gray-900 font-semibold text-lg">{booking.tourDescription}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Departure Date</p>
                <p className="text-gray-900 font-semibold text-lg">{booking.departureDate}</p>
              </div>
            </div>
          </div>

          {/* 2. Passengers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                Passenger Details <span className="text-gray-400 font-normal text-sm">({passengers.length} Travellers)</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {passengers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="bg-gray-200 text-gray-600 font-bold w-6 h-6 flex items-center justify-center rounded text-xs">{i + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{p.passengerName}</p>
                      <p className="text-xs text-gray-500">DOB: {p.dateOfBirth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Cost Summary & Action */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h2 className="font-bold text-gray-900 text-xl mb-6">Payment Summary</h2>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Base Tour Cost</span>
                  <span className="font-medium">₹ {booking.tourAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees (5%)</span>
                  <span className="font-medium">₹ {booking.taxAmount?.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-800">Total Payable Amount</span>
                  <span className="font-bold text-2xl text-emerald-600">₹ {booking.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate(`/payment/${bookingId}`)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
                >
                  Proceed to Payment
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
