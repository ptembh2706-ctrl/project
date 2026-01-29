import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCostsByCategory } from "../../api/costApi";

const CostTab = () => {
  const { catmasterId } = useParams();

  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCostsByCategory(catmasterId)
      .then(res => {
        setCosts(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load cost details");
        setLoading(false);
      });
  }, [catmasterId]);

  /* ---------- STATES ---------- */

  if (loading) return <div className="p-8 text-center text-gray-500">Loading cost details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (costs.length === 0) return <div className="p-8 text-center text-gray-500">No cost information available.</div>;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Tour Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costs.map((cost, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header: Validity */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Validity Period</p>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <span className="bg-white px-2 py-1 rounded border border-blue-200 text-sm shadow-sm">{cost.validFromDate}</span>
                <span className="text-blue-400">→</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-200 text-sm shadow-sm">{cost.validToDate}</span>
              </div>
            </div>

            {/* Body: Prices */}
            <div className="p-6 space-y-4">

              <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                <span className="text-gray-600">Single Person</span>
                <span className="text-lg font-bold text-gray-900">₹ {cost.singlePersonCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                <span className="text-gray-600">Extra Person</span>
                <span className="text-lg font-bold text-gray-900">₹ {cost.extraPersonCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                <span className="text-gray-600">Child (With Bed)</span>
                <span className="font-semibold text-gray-800">₹ {cost.childWithBedCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Child (No Bed)</span>
                <span className="font-semibold text-gray-800">₹ {cost.childWithoutBedCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostTab;
