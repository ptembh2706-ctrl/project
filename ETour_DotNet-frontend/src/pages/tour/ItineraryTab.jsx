import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItineraryByCategory } from "../../api/itineraryApi";

const ItineraryTab = () => {
  const { catmasterId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItineraryByCategory(catmasterId)
      .then(res => {
        // Sort by day number to ensure correct order
        const sorted = (res.data || []).sort((a, b) => a.dayNumber - b.dayNumber);
        setItinerary(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [catmasterId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading itinerary...</div>;
  if (!itinerary || itinerary.length === 0) return <div className="p-8 text-center text-gray-500">Itinerary details coming soon.</div>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Day-wise Itinerary</h2>

      <div className="relative border-l-2 border-teal-100 ml-4 space-y-12">
        {itinerary.map((item, index) => (
          <div key={item.itrId || index} className="relative pl-10">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-0 flex items-center justify-center w-9 h-9 bg-teal-500 rounded-full text-white font-bold text-sm shadow-md ring-4 ring-white">
              {item.dayNumber}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                {`Day ${item.dayNumber}`}
              </h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                {item.itineraryDetails || "No details available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTab;
