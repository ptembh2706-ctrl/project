import React from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const TourResultCard = ({ tour }) => {
    // SearchResultDTO fields: tourId, catmasterId, tourName, startDate, endDate, duration, tourCost, imagePath

    // Formatting currency
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
            {/* Added Image Section */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={`${BACKEND_URL}${tour.imagePath}`}
                    alt={tour.tourName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=Tour+Image";
                    }}
                />
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {tour.duration} Days
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                            Tour #{tour.tourId}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {tour.tourName}
                    </h3>

                    <div className="space-y-2 mb-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">
                                {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Starting from</p>
                            <p className="text-2xl font-extrabold text-blue-600">
                                {formatter.format(tour.tourCost)}
                            </p>
                        </div>
                        <Link
                            to={`/tours/${tour.catmasterId}`}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            View
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourResultCard;
