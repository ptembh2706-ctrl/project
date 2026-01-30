import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTourDetails } from "../../api/tourApi";

const TourPage = () => {
  const { catmasterId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTourDetails(catmasterId)
      .then(res => {
        setTour(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [catmasterId]);

  const navLinkClass = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-all duration-200 ${isActive
      ? "bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-600 shadow-sm"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  if (loading) return <div className="p-12 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div></div>;
  if (!tour) return <div className="p-12 text-center text-red-500">Tour not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 pt-24">
      <div className="container mx-auto px-6 max-w-7xl">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SIDEBAR (Sticky) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">

              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Twin Sharing</p>
                <h2 className="text-3xl font-bold text-gray-900">
                  ₹{tour.baseCost.toLocaleString()}
                </h2>
                <p className="text-xs text-gray-400 mt-1">per person</p>
                <p className="text-[10px] text-gray-400 mt-1">*Single supplement applies for solo travelers</p>

                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-3 text-left">
                  <p className="text-[10px] text-orange-800 font-bold uppercase tracking-wider mb-1">Pricing Policy</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Prices shown are for <strong>Twin Sharing</strong> (2 people).
                    <br />
                    Solo travelers will incur a <strong>Single Supplement</strong> fee to cover full room costs.
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/tours/${catmasterId}/book`)}
                  className="mt-4 w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
                >
                  Book Now
                </button>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                <nav className="space-y-1">
                  <NavLink to={`/tours/${catmasterId}`} end className={navLinkClass}>
                    Overview
                  </NavLink>
                  <NavLink to="itinerary" className={navLinkClass}>
                    Day-wise Itinerary
                  </NavLink>
                  <NavLink to="cost" className={navLinkClass}>
                    Cost Details
                  </NavLink>
                  <NavLink to="departures" className={navLinkClass}>
                    Departure Dates
                  </NavLink>
                </nav>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              {/* Pass tour data to children so specific tabs don't always need to refetch if not needed */}
              <Outlet context={{ tour }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TourPage;