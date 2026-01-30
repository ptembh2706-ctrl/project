import { useState, useEffect } from "react";
import { getMainCategories, searchCategories } from "../api/categoryApi";
import { searchByPeriod, searchByDuration, searchByCost } from "../api/searchApi";
import CategoryCard from "../components/CategoryCard";
import TourResultCard from "../components/TourResultCard";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [resultType, setResultType] = useState('category'); // 'category' or 'tour'

    useEffect(() => {
        // Load default categories
        getMainCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSearch = (searchParams) => {
        // Check if any filter is active
        const hasFilters = Object.values(searchParams).some(val => val !== '' && val !== null);

        if (!hasFilters) {
            setIsSearching(false);
            setResultType('category');
            return;
        }

        setIsSearching(true);
        setSearchResults([]); // clear previous

        // Logic to choose which API to call
        // Priority: Date > Duration > Cost > Destination (Default)
        let searchPromise;
        let type = 'tour';

        if (searchParams.startDate && searchParams.endDate) {
            searchPromise = searchByPeriod(searchParams.startDate, searchParams.endDate);
        } else if (searchParams.minDays || searchParams.maxDays) {
            // Ensure inputs are integers
            const min = searchParams.minDays ? parseInt(searchParams.minDays) : 0;
            const max = searchParams.maxDays ? parseInt(searchParams.maxDays) : 100;
            searchPromise = searchByDuration(min, max);
        } else if (searchParams.minBudget || searchParams.maxBudget) {
            const min = searchParams.minBudget || 0;
            const max = searchParams.maxBudget || 1000000;
            searchPromise = searchByCost(min, max);
        } else if (searchParams.query) {
            // Fallback to category search (Destination)
            type = 'category';
            searchPromise = searchCategories({ query: searchParams.query });
        } else {
            // No valid specific filter found but hasFilters was true? 
            // Maybe just one date? Ignore or handle.
            setIsSearching(false);
            return;
        }

        setResultType(type);

        if (searchPromise) {
            searchPromise
                .then(res => setSearchResults(res.data))
                .catch(err => {
                    console.error("Search failed", err);
                    setSearchResults([]);
                });
        }
    };

    const displayItems = isSearching ? searchResults : categories;
    const isTourResults = isSearching && resultType === 'tour';

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <HeroSection />

            {/* Overlapping Search Bar */}
            <div className="container mx-auto px-6 -mt-16 relative z-30">
                <SearchBar onSearch={handleSearch} />
            </div>

            <div id="tours-section" className="container mx-auto px-6 py-20 animate-fade-in-up">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">
                        {isSearching ? 'Search Results' : 'Destinations'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        {isSearching
                            ? `Found ${searchResults.length} Result(s)`
                            : 'Popular Categories'}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        {isSearching
                            ? "Here are the tours matching your criteria. Explore and book your next adventure!"
                            : "From sandy beaches to snowy mountains, explore our wide range of tour categories."}
                    </p>
                </div>

                {displayItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayItems.map((item, index) => (
                            isTourResults ? (
                                <TourResultCard key={item.tourId || index} tour={item} />
                            ) : (
                                <CategoryCard key={item.categoryId || item.id} category={item} />
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🌍</div>
                        <p className="text-2xl font-bold text-gray-700 mb-2">No tours found</p>
                        <p className="text-gray-500 mb-6">Try adjusting your search criteria.</p>
                        <button
                            onClick={() => {
                                setIsSearching(false);
                                setResultType('category');
                            }}
                            className="text-blue-600 font-bold hover:text-blue-800 transition underline"
                        >
                            View All Categories
                        </button>
                    </div>
                )}
            </div>

            {/* About Section - Modernized */}
            <div id="about-section" className="bg-white py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-50 rounded-full z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Traveler"
                                className="relative z-10 rounded-3xl shadow-2xl w-full h-[600px] object-cover hover:scale-[1.01] transition duration-500"
                            />

                            {/* Stats Floating Card */}

                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">About Us</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                            Plan Your Trip with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">E-Tour Classics</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Travel isn’t just about places — it’s about stories you’ll remember long after the journey ends. At E-Tour Classics, we design experiences that take you beyond sightseeing, combining iconic destinations with authentic moments, comfort, and care.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed mb-10">
                            From peaceful pilgrimages and wildlife safaris to international highlights and scenic escapes, every tour is thoughtfully curated to give you a smooth, enriching, and memorable travel experience — just the way it should be.
                        </p>


                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;