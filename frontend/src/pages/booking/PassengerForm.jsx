import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { createBooking } from "../../api/bookingApi";

const PassengerForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Initialize with defaults - will load from sessionStorage in useEffect
  const [passengers, setPassengers] = useState([{ name: "", dob: "", gender: "", type: "" }]);
  const [roomPreference, setRoomPreference] = useState("AUTO");
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);



  // Load saved data from sessionStorage AFTER component mounts
  // This fixes the timing issue where state isn't available during initial render
  useEffect(() => {


    if (state?.departureDateId) {
      const saved = sessionStorage.getItem('bookingPassengers');

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          // Only use saved data if it's for the same departure
          if (parsed.departureDateId === state.departureDateId) {
            setPassengers(parsed.passengers);
            setRoomPreference(parsed.roomPreference || "AUTO");
          }
        } catch (e) {
          console.error('Failed to parse saved passengers', e);
        }
      }
      setIsLoaded(true);
    }
  }, [state?.departureDateId]);

  // Save to sessionStorage whenever passengers or roomPreference changes
  // Only save after initial load to avoid overwriting with defaults
  useEffect(() => {
    if (state?.departureDateId && isLoaded) {
      const dataToSave = {
        departureDateId: state.departureDateId,
        passengers,
        roomPreference
      };
      sessionStorage.setItem('bookingPassengers', JSON.stringify(dataToSave));
    }
  }, [passengers, roomPreference, state?.departureDateId, isLoaded]);

  // If state is missing (e.g. direct access), redirect back
  if (!state) {
    navigate("/");
    return null;
  }

  // Calculate passenger type based on age at departure date
  const calculatePassengerType = (dob) => {
    if (!dob || !state.departureDate) return "";
    const dobDate = new Date(dob);
    const depDate = new Date(state.departureDate);
    let age = depDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = depDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && depDate.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age >= 18) return "ADULT";
    if (age >= 2) return "CHILD_WITH_BED"; // Default child to with bed
    return "INFANT";
  };

  // Get age description for display
  const getAgeDescription = (dob) => {
    if (!dob || !state.departureDate) return "";
    const dobDate = new Date(dob);
    const depDate = new Date(state.departureDate);
    let age = depDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = depDate.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && depDate.getDate() < dobDate.getDate())) {
      age--;
    }
    return `${age} years old on departure`;
  };

  // Passenger summary counts
  const passengerSummary = useMemo(() => {
    let adults = 0, children = 0, infants = 0;
    passengers.forEach(p => {
      const type = p.type || calculatePassengerType(p.dob);
      if (type === "ADULT") adults++;
      else if (type === "INFANT") infants++;
      else if (type.startsWith("CHILD")) children++;
    });
    return { adults, children, infants };
  }, [passengers, state.departureDate]);

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", dob: "", gender: "", type: "" }]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;

    // Auto-calculate type when DOB changes (if type not manually set)
    if (field === "dob" && !updated[index].type) {
      updated[index].autoType = calculatePassengerType(value);
    }

    setPassengers(updated);
  };

  const handleCancel = () => {
    // Clear saved data when canceling
    sessionStorage.removeItem('bookingPassengers');
    navigate(-1); // Go back to previous page
  };

  const handleConfirmBooking = async () => {
    // Block booking if no passengers
    if (passengers.length === 0) {
      alert("Please add at least one passenger");
      return;
    }

    // Validate inputs
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (!p.name || !p.dob || !p.gender) {
        alert(`Please fill in all details for Passenger ${i + 1} (Name, Date of Birth, and Gender are required)`);
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
        customerId: customerId,
        tourId: state.tourId,
        departureDateId: state.departureDateId,
        roomPreference: roomPreference,
        passengers: passengers.map(p => ({
          passengerName: p.name,
          dateOfBirth: p.dob,
          gender: p.gender,
          passengerType: p.type || calculatePassengerType(p.dob)
        }))
      };

      console.log("DEBUG: Booking payload:", payload);

      const res = await createBooking(payload);
      const bookingId = res.data.id;

      // Note: NOT clearing sessionStorage here so user can go back and edit if needed
      // It will be cleared when they click Cancel or start a fresh booking

      navigate(`/booking/${bookingId}/summary`);
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if passenger is a child (age 2-17)
  const isChild = (dob) => {
    const type = calculatePassengerType(dob);
    return type.startsWith("CHILD");
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
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Departure Date</p>
                  <p className="font-semibold text-gray-900">{state.departureDate}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Pax Summary</p>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm"><span className="font-bold text-emerald-600">{passengerSummary.adults}</span> Adult(s)</p>
                    <p className="text-sm"><span className="font-bold text-blue-600">{passengerSummary.children}</span> Child(ren)</p>
                    <p className="text-sm"><span className="font-bold text-purple-600">{passengerSummary.infants}</span> Infant(s)</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Passengers</p>
                  <p className="font-bold text-emerald-600 text-xl">{passengers.length}</p>
                </div>
              </div>

              {/* Room Preference Section */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Room Preference</p>
                <div className="space-y-3">
                  <label className={`block p-3 rounded-lg border cursor-pointer transition-all ${roomPreference === 'AUTO' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="roomPreference"
                        value="AUTO"
                        checked={roomPreference === "AUTO"}
                        onChange={(e) => setRoomPreference(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm font-medium">Auto (Recommended)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-5">System optimizes room allocation based on passenger count. Best value for most bookings.</p>
                  </label>
                  <label className={`block p-3 rounded-lg border cursor-pointer transition-all ${roomPreference === 'ODD_SINGLE_TWIN' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="roomPreference"
                        value="ODD_SINGLE_TWIN"
                        checked={roomPreference === "ODD_SINGLE_TWIN"}
                        onChange={(e) => setRoomPreference(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm font-medium">Single + Twin Sharing</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-5">For odd passengers: 1 single room + remaining in twin sharing. Single room has extra charge.</p>
                  </label>
                  <label className={`block p-3 rounded-lg border cursor-pointer transition-all ${roomPreference === 'ALL_TWIN_RANDOM' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="roomPreference"
                        value="ALL_TWIN_RANDOM"
                        checked={roomPreference === "ALL_TWIN_RANDOM"}
                        onChange={(e) => setRoomPreference(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm font-medium">All Twin Sharing</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-5">All passengers in twin sharing rooms. Odd passenger paired randomly with another guest.</p>
                  </label>
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
                    {p.dob && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${calculatePassengerType(p.dob) === 'ADULT' ? 'bg-emerald-100 text-emerald-700' :
                        calculatePassengerType(p.dob) === 'INFANT' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                        {calculatePassengerType(p.dob).replace(/_/g, ' ')}
                      </span>
                    )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                      value={p.name}
                      onChange={e => handlePassengerChange(i, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={p.dob}
                      onChange={e => handlePassengerChange(i, "dob", e.target.value)}
                      required
                    />
                    {p.dob && (
                      <p className="text-xs text-gray-500 mt-1">{getAgeDescription(p.dob)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={p.gender}
                      onChange={e => handlePassengerChange(i, "gender", e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Show bed preference only for children (age 2-17) */}
                  {isChild(p.dob) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bed Preference</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={p.type || "CHILD_WITH_BED"}
                        onChange={e => handlePassengerChange(i, "type", e.target.value)}
                      >
                        <option value="CHILD_WITH_BED">With Bed (Extra charge)</option>
                        <option value="CHILD_WITHOUT_BED">Without Bed (Reduced charge)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addPassenger}
                  className="flex-1 sm:flex-none px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Passenger
                </button>
              </div>

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
