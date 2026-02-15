import { useState, useEffect } from "react";
import { getAllDestinations } from "../api/destinationApi";
const DestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAllDestinations()
            .then(data => setDestinations(data))
            .catch(err => console.error("Error:", err))
            .finally(() => setLoading(false));
    }, []);
    const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Loading destinations...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 pt-24">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    🌍 Explore Destinations
                </h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                                <h2 className="text-2xl font-bold text-white">{dest.name}</h2>
                            </div>
                            {/* Content */}
                            <div className="p-5">
                                {/* Best Time & Temperature */}
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1 bg-green-50 p-3 rounded-lg">
                                        <p className="text-xs text-green-600 font-medium">Best Time</p>
                                        <p className="font-semibold text-green-800">{dest.bestTimeToVisit}</p>
                                    </div>
                                    <div className="flex-1 bg-orange-50 p-3 rounded-lg">
                                        <p className="text-xs text-orange-600 font-medium">Temperature</p>
                                        <p className="font-semibold text-orange-800">{dest.temperature}</p>
                                    </div>
                                </div>
                                {/* Features */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dest.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* Reviews */}
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Reviews:</p>
                                    <div className="space-y-2">
                                        {dest.reviews.map((review, idx) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">{review.name}</span>
                                                    <span className="text-yellow-500">{renderStars(review.rating)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default DestinationsPage;
