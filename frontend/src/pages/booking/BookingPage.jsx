import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTourDetails } from "../../api/tourApi";
import { getDepartureDatesByCategory } from "../../api/departureApi";

const BookingPage = () => {
    const { catmasterId } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [departureDates, setDepartureDates] = useState([]);
    const [selectedDateId, setSelectedDateId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getTourDetails(catmasterId),
            getDepartureDatesByCategory(catmasterId)
        ]).then(([tourRes, datesRes]) => {
            setTour(tourRes.data.tour ?? tourRes.data);
            setDepartureDates(datesRes.data || []);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load booking details", err);
            setLoading(false);
        });
    }, [catmasterId]);

    const handleContinue = () => {
        if (!selectedDateId) return;

        const selectedDep = departureDates.find(d => d.id === selectedDateId);

        navigate("/booking/passengers", {
            state: {
                catmasterId,
                departureDateId: selectedDateId,
                tourName: tour?.tourName || tour?.categoryName,
                tourId: tour?.tourId || tour?.id || catmasterId, // Fallback to catmasterId if no tourId
                departureDate: selectedDep?.departureDate // Pass the actual departure date string
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

    if (!tour) return <div className="min-h-screen flex items-center justify-center text-red-500">Tour details not found.</div>;

    const selectedDateObj = departureDates.find(d => d.id === selectedDateId);

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Book Your Tour</h1>
                    <p className="text-gray-500 mt-2">Step 1: Select your preferred travel dates</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Tour Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{tour.categoryName}</h2>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between border-b border-dashed pb-2">
                                    <span>Duration</span>
                                    <span className="font-semibold text-gray-900">{tour.numberOfDays} Days</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-2">
                                    <span>Base Price</span>
                                    <span className="font-semibold text-gray-900">₹{tour.baseCost?.toLocaleString()}</span>
                                </div>
                                {selectedDateObj && (
                                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-fade-in">
                                        <p className="text-emerald-700 font-medium">Selected Date:</p>
                                        <p className="text-emerald-900 font-bold text-lg">{selectedDateObj.departureDate}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Date Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                                Choose Departure Date
                            </h3>

                            {departureDates.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">No upcoming dates available for this tour currently.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {departureDates.map(date => (
                                        <div
                                            key={date.id}
                                            onClick={() => setSelectedDateId(date.id)}
                                            className={`
                                                cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 flex flex-col items-center text-center
                                                ${selectedDateId === date.id
                                                    ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-[1.02]'
                                                    : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Departure</p>
                                            <p className="text-xl font-bold text-gray-900 mb-1">{date.departureDate}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${selectedDateId === date.id ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                                                {date.endDate ? `Until ${date.endDate}` : `${date.numberOfDays} Days`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-10 flex justify-end">
                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedDateId}
                                    className={`
                                        px-8 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg
                                        ${selectedDateId
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30 hover:-translate-y-1'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    Continue to Passengers →
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
