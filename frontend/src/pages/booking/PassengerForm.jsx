import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createBooking } from "../../api/bookingApi";

const PassengerForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ONLY passengers (no primary/secondary concept)
  const [passengers, setPassengers] = useState([
    { name: "", dob: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);

  // If state is missing (e.g. direct access), redirect back
  if (!state) {
    navigate("/");
    return null;
  }

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", dob: "" }]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleConfirmBooking = async () => {
    // 🚫 Block booking if no passengers
    if (passengers.length === 0) {
      alert("Please add at least one passenger");
      return;
    }

    // Validate inputs
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (!p.name || !p.dob) {
        alert(`Please fill in all details for Passenger ${i + 1}`);
        return;
      }

      // Validate name (at least 2 characters)
      if (p.name.trim().length < 2) {
        alert(`Passenger ${i + 1}: Please enter a valid name`);
        return;
      }

      // Validate date of birth (not in future)
      const dobDate = new Date(p.dob);
      const today = new Date();
      if (dobDate > today) {
        alert(`Passenger ${i + 1}: Date of birth cannot be in the future`);
        return;
      }

      // Check if passenger is born (simple future check covers it, but ensuring valid date)
      if (isNaN(dobDate.getTime())) {
        alert(`Passenger ${i + 1}: Invalid date of birth`);
        return;
      }
    }

    const customerId = Number(localStorage.getItem("customerId"));
    if (!customerId) {
      alert("Your session has expired or is invalid. Please login again.");
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customerId: customerId, // booking owner
        tourId: state.tourId,
        departureDateId: state.departureDateId,
        roomPreference: "AUTO",
        passengers: passengers.map(p => ({
          passengerName: p.name,
          dateOfBirth: p.dob
        }))
      };

      const res = await createBooking(payload);
      const bookingId = res.data.id;

      navigate(`/booking/${bookingId}/summary`);
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Passenger Details</h1>
          <p className="text-gray-500 mt-2">Step 2: Who is travelling?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Tour</p>
                  <p className="font-semibold text-gray-900">{state.tourName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Passengers</p>
                  <p className="font-bold text-emerald-600 text-xl">{passengers.length}</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
                <p>Please ensure names match government ID proofs carried during travel.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Passenger Forms */}
          <div className="lg:col-span-2 space-y-6">

            {passengers.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up relative group">

                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {i + 1}
                    </span>
                    Passenger {i + 1}
                  </h3>

                  {passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove Passenger"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                      value={p.name}
                      onChange={e => handlePassengerChange(i, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={p.dob}
                      onChange={e => handlePassengerChange(i, "dob", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <button
                onClick={addPassenger}
                className="w-full sm:w-auto px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Another Passenger
              </button>

              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className={`
                                w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all
                                ${submitting ? 'opacity-70 cursor-wait' : ''}
                            `}
              >
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
