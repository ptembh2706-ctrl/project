import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { getTourDetails } from "../api/tourApi";

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const imageUrl = `${BACKEND_URL}${category.imagePath}`;

    useEffect(() => {
        // Try to fetch tour details (price, duration) if this is a tour-level category
        const fetchDetails = async () => {
            try {
                // Use category.id (catmaster_id) to fetch details
                const res = await getTourDetails(category.id);
                // Only use details if we have a valid baseCost to avoid showing broken cards for main categories
                if (res.data && res.data.baseCost > 0) {
                    setDetails(res.data);
                }
            } catch (err) {
                // If 404 or other error, it might just be a regular category container, which is fine
                // console.log("Not a tour package or details unavailable");
            }
        };

        if (category.id) {
            fetchDetails();
        }
    }, [category.id]);

    // If we have tour details, show the "Package" style card
    if (details) {
        return (
            <div
                onClick={() => navigate(`/categories/${category.categoryId}`)}
                className="group relative w-full cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-[380px]"
            >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Best Seller Badge (Mock) */}
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Best Seller
                    </div>
                    {/* Heart Icon (Mock) */}
                    <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 hover:bg-white transition-all">
                        <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {category.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="line-clamp-1">Trending Destination</span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-xl font-bold text-emerald-600">₹{details.baseCost.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">/ person</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{details.numberOfDays - 1}N/{details.numberOfDays}D</span>
                            </div>
                        </div>

                        <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all text-sm shadow-sm group-hover:shadow-md">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback "Category" style card (for non-tour categories)
    return (
        <div
            onClick={() => navigate(`/categories/${category.categoryId}`)}
            className="group relative h-[320px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl"
        >
            {/* Background Image */}
            <img
                src={imageUrl}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 transform transition-transform duration-500">
                <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                    Collection
                </span>

                <h2 className="mb-2 text-3xl font-bold uppercase leading-tight text-white tracking-tight">
                    {category.name}
                </h2>

                <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform duration-300 hover:bg-gray-200 hover:scale-105 active:scale-95 mt-4">
                    Explore
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
        </div>
    );
};

export default CategoryCard;