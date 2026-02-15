import { useOutletContext } from "react-router-dom";

const Overview = () => {
  const { tour } = useOutletContext(); // Access data passed from TourPage

  if (!tour) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-teal-500 pl-4">
        {tour.categoryName}
      </h2>

      <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
        <p>{tour.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
          <p className="text-teal-600 text-sm font-bold uppercase tracking-wider mb-2">Duration</p>
          <p className="text-2xl font-bold text-gray-800">{tour.numberOfDays} Days</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">Tour Type</p>
          <p className="text-2xl font-bold text-gray-800">Group Tour</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <p className="text-purple-600 text-sm font-bold uppercase tracking-wider mb-2">Activities</p>
          <p className="text-2xl font-bold text-gray-800">Sightseeing</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
