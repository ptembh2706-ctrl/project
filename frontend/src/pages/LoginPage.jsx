import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginCustomer } from '../api/customerApi';
import { login } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Google OAuth2 Redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error('Invalid token format');

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Validate required fields
        if (!decoded.userId && !decoded.sub) {
          throw new Error('Token missing user identifier');
        }

        const authData = {
          token: token,
          id: decoded.userId || decoded.sub,
          name: decoded.name || decoded.firstName || "User",
          email: decoded.sub,
          role: decoded.role || 'CUSTOMER'
        };

        login(authData);
        navigate('/', { replace: true });
      } catch (e) {
        console.error("Failed to process Google login token", e);
        setError("Google login failed. Please try again.");
      }
    }
  }, [location, navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await loginCustomer({
        email: formData.email,
        password: formData.password
      });

      if (!response.role) {
        response.role = 'CUSTOMER';
      }

      login(response);

      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("Login failed:", err);
      setError(t('login.error') || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="relative z-10 w-full h-full flex flex-col justify-end p-16">
          <blockquote className="space-y-2">
            <p className="text-lg text-emerald-300 font-medium tracking-wide uppercase">Start Your Journey</p>
            <h2 className="text-4xl font-bold text-white leading-tight">
              "To travel is to live."
            </h2>
            <p className="text-gray-400 mt-4">— Hans Christian Andersen</p>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="text-2xl font-bold text-emerald-600 tracking-tight">{t('app.name') || "E-Tour"}</Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="mt-2 text-gray-600">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign in with email</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('login.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('login.signing_in')}
                </span>
              ) : t('login.button')}
            </button>
          </form>

          <div className="relative">
            {/* Removed the 'Or' divider here as we moved it up */}
          </div>

          <p className="text-center text-sm text-gray-600">
            {t('login.no_account')}{" "}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              {t('login.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
