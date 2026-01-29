import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomerName, subscribeToAuthChanges } from '../utils/auth';

const Footer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getCustomerName());

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(() => {
            setIsLoggedIn(!!getCustomerName());
        });
        return () => unsubscribe();
    }, []);

    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold font-display text-white mb-4 block">
                            E-Tour<span className="text-blue-500">.</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Discover the world with premium tours designed for unforgettable experiences. Your adventure begins here.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link to="/tours" className="hover:text-blue-400 transition-colors">All Tours</Link></li>
                            {!isLoggedIn && (
                                <>
                                    <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
                                    <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Support</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest travel deals.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
                            />
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                Go
                            </button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} E-Tour Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-500 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
