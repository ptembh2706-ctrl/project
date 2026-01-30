import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import DestinationsPage from "../pages/DestinationsPage";
import CategoryPage from "../pages/CategoryPage";
import TourPage from "../pages/tour/TourPage";
import Overview from "../pages/tour/Overview";
import CostTab from "../pages/tour/CostTab";
import DeparturedateTab from "../pages/tour/DepartureDateTab";
import ItineraryTab from "../pages/tour/ItineraryTab";
import BookingPage from "../pages/booking/BookingPage";
import PassengerForm from "../pages/booking/PassengerForm";
import BookingSummary from "../pages/booking/BookingSummary";
import PaymentPage from "../pages/booking/PaymentPage";
import PaymentSuccess from "../pages/booking/PaymentSuccess";
import PaymentFailure from "../pages/booking/PaymentFailure";
import BookingDetailsPage from "../pages/BookingDetailsPage";
import RequireLogin from "../components/RequireLogin";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Admin Imports
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CategoryManager from '../pages/admin/CategoryManager';
import TourManager from '../pages/admin/TourManager';
import CostManager from '../pages/admin/CostManager';
import ItineraryManager from '../pages/admin/ItineraryManager';
import CustomerManager from '../pages/admin/CustomerManager';
import CustomerUpload from '../pages/admin/CustomerUpload';
import PaymentManager from '../pages/admin/PaymentManager';
import RequireAdmin from '../components/admin/RequireAdmin';


const MainContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />

        {/* <Route path="/tours/:catmasterId" element={<TourDetails />} /> */}

        <Route path="/tours/:catmasterId" element={
          <TourPage />} >
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
          <Route path="customers" element={<CustomerManager />} />
          <Route path="customers/upload" element={<CustomerUpload />} />
          <Route path="payments" element={<PaymentManager />} />
        </Route>

      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}
