import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// Components (Keep Navbar/Footer eager as they are always needed)
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import RequireLogin from "../components/RequireLogin";
import RequireAdmin from '../components/admin/RequireAdmin';

// Loading Component
const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// Lazy Imports
const Home = lazy(() => import("../pages/Home"));
const DestinationsPage = lazy(() => import("../pages/DestinationsPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const TourPage = lazy(() => import("../pages/tour/TourPage"));

// Nested Tour Tabs
const Overview = lazy(() => import("../pages/tour/Overview"));
const CostTab = lazy(() => import("../pages/tour/CostTab"));
const DeparturedateTab = lazy(() => import("../pages/tour/DepartureDateTab"));
const ItineraryTab = lazy(() => import("../pages/tour/ItineraryTab"));

// Booking & Auth
const BookingPage = lazy(() => import("../pages/booking/BookingPage"));
const PassengerForm = lazy(() => import("../pages/booking/PassengerForm"));
const BookingSummary = lazy(() => import("../pages/booking/BookingSummary"));
const PaymentPage = lazy(() => import("../pages/booking/PaymentPage"));
const PaymentSuccess = lazy(() => import("../pages/booking/PaymentSuccess"));
const PaymentFailure = lazy(() => import("../pages/booking/PaymentFailure"));
const BookingDetailsPage = lazy(() => import("../pages/BookingDetailsPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

// Admin
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CategoryManager = lazy(() => import('../pages/admin/CategoryManager'));
const TourManager = lazy(() => import('../pages/admin/TourManager'));
const CostManager = lazy(() => import('../pages/admin/CostManager'));
const ItineraryManager = lazy(() => import('../pages/admin/ItineraryManager'));
const DepartureManager = lazy(() => import('../pages/admin/DepartureManager'));
const CustomerManager = lazy(() => import('../pages/admin/CustomerManager'));
const CustomerUpload = lazy(() => import('../pages/admin/CustomerUpload'));
const PaymentManager = lazy(() => import('../pages/admin/PaymentManager'));

const MainContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />

          <Route path="/tours/:catmasterId" element={<TourPage />}>
            <Route index element={<Overview />} />
            <Route path="cost" element={<CostTab />} />
            <Route path="departures" element={<DeparturedateTab />} />
            <Route path="itinerary" element={<ItineraryTab />} />
          </Route>

          <Route
            path="/tours/:catmasterId/book"
            element={
              <RequireLogin>
                <BookingPage />
              </RequireLogin>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/booking/passengers" element={<PassengerForm />} />
          <Route path="/booking/:bookingId/passengers" element={<PassengerForm />} />

          <Route path="/booking/:bookingId/summary" element={<BookingSummary />} />

          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/payment/success/:bookingId" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

          <Route
            path="/bookings/:bookingId"
            element={
              <RequireLogin>
                <BookingDetailsPage />
              </RequireLogin>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="tours" element={<TourManager />} />
            <Route path="costs" element={<CostManager />} />
            <Route path="itineraries" element={<ItineraryManager />} />
            <Route path="departures" element={<DepartureManager />} />
            <Route path="customers" element={<CustomerManager />} />
            <Route path="customers/upload" element={<CustomerUpload />} />
            <Route path="payments" element={<PaymentManager />} />
          </Route>

        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainContent />
    </BrowserRouter>
  );
}
