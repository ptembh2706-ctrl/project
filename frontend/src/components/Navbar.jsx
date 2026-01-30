import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCustomerName, getCustomerRole, subscribeToAuthChanges, logout as authLogout } from "../utils/auth";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerName, setCustomerName] = useState(getCustomerName());
  // Fetch categories for dropdown
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(() => {
      setCustomerName(getCustomerName());
    });

    // Fetch categories for the dropdown menu
    import("../api/categoryApi").then(module => {
      module.getMainCategories().then(res => {
        setCategories(res.data);
      }).catch(err => console.error(err));
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    authLogout();
    navigate("/");
  };

  const scrollToAbout = () => {
    navigate("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav border-b border-white/10 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Left Side: Logo & Nav Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* Creative Icon Logo */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/30"></div>
              <div className="absolute inset-0 bg-teal-600 rounded-xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-90 flex items-center justify-center">
                <span className="text-white font-display font-bold text-2xl italic pr-1">e</span>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-bold font-display text-white tracking-tight leading-none group-hover:text-emerald-200 transition-colors">
                E-Tour
              </h2>
              <span className="text-[10px] text-gray-400 font-medium tracking-[0.2em] uppercase leading-none pl-0.5 group-hover:tracking-[0.3em] transition-all">Classics</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Home
            </button>

            {/* Tours Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-300 group-hover:text-white font-medium text-sm transition-colors py-2">
                Tours
                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl py-2 transition-all duration-200 transform origin-top-left ${showDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Destinations
                </div>
                {categories.slice(0, 8).map(cat => (
                  <button
                    key={cat.id || cat.categoryId}
                    onClick={() => navigate(`/categories/${cat.categoryId}`)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => navigate("/")}
                  className="block w-full text-left px-4 py-2.5 text-sm text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  View All Categories →
                </button>
              </div>
            </div>

            <button
              onClick={scrollToAbout}
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              About
            </button>
          </div>
        </div>

        {/* Right Section: Auth */}
        <div className="flex items-center gap-6">
          {location.pathname === '/login' && <LanguageSwitcher />}

          {customerName ? (
            <div className="relative group">
              {/* Profile Icon Layer */}
              <div
                className="flex items-center gap-3 cursor-pointer py-2"
                onClick={() => navigate('/profile')}
              >
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-xs text-blue-200 font-medium uppercase tracking-wider">Welcome</span>
                  <span className="text-sm font-bold text-white max-w-[100px] truncate">{customerName}</span>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Hover Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 transform opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 origin-top-right border border-gray-100">

                {/* Arrow */}
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl mb-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{customerName}</p>
                </div>

                {getCustomerRole() === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      Admin Dashboard
                    </button>
                    <div className="my-1 border-t border-gray-100"></div>
                  </>
                )}

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Profile
                </button>

                <div className="my-1 border-t border-gray-100"></div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
