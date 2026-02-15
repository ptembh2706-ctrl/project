import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDepartureDatesByCategory } from "../../api/departureApi";

const DepartureDateTab = () => {
  const { catmasterId } = useParams();

  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getDepartureDatesByCategory(catmasterId)
      .then(res => {
        setDates(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load departure dates");
        setLoading(false);
      });
  }, [catmasterId]);

  /* ---------- STATES ---------- */

  if (loading) {
    return <p>Loading departure dates...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (dates.length === 0) {
    return <p>No departure dates available.</p>;
  }

  /* ---------- UI ---------- */

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dates.map(date => (
        <div
          key={date.id}
          className="
          border
          rounded-xl
          p-6
          shadow-md
          bg-white
        "
        >
          <p className="text-sm text-gray-500 mb-1">
            Departure Date
          </p>

          <p className="text-2xl font-semibold text-gray-900 mb-3">
            {date.departureDate}
          </p>

          <p className="text-base text-gray-600 mb-1">
            <span className="font-medium text-gray-700">End Date:</span>{" "}
            {date.endDate}
          </p>

          <p className="text-base text-gray-600">
            <span className="font-medium text-gray-700">Duration:</span>{" "}
            {date.numberOfDays} Days
          </p>
        </div>
      ))}
    </div>
  );
};

export default DepartureDateTab;
