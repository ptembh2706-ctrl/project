import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomerName, subscribeToAuthChanges } from '../utils/auth';

const HeroSection = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!getCustomerName());

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(() => {
            setIsLoggedIn(!!getCustomerName());
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="relative h-[800px] flex items-center justify-center overflow-hidden pb-32">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Travel Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto">

                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold tracking-wider uppercase mb-4">
                        Explore the world with us
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                        Discover Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-sky-200">
                            Great Adventure
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience premium tours curated for the modern traveler.
                        Unforgettable journeys await.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => document.getElementById('tours-section').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1"
                        >
                            Explore Destinations
                        </button>

                        {!isLoggedIn && (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg transition-all"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
