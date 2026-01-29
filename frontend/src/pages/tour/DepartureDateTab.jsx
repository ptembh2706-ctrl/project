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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {dates.map(date => (
        <div
          key={date.id}
          className="border p-4 rounded-lg shadow-sm"
        >
          <p className="text-sm text-gray-500">Departure Date</p>
          <p className="text-lg font-semibold">
            {date.departureDate}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            End Date: {date.endDate}
          </p>

          <p className="text-sm text-gray-600">
            Duration: {date.numberOfDays} Days
          </p>
        </div>
      ))}
    </div>
  );
};

export default DepartureDateTab;
