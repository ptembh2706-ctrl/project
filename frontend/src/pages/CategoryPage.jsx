import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleCategoryClick } from "../api/categoryApi";
import { BACKEND_URL } from "../config";
import CategoryCard from "../components/CategoryCard";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("Tours"); // Default name until loaded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    handleCategoryClick(categoryId)
      .then(res => {
        const response = res.data;

        // SUBCATEGORIES
        if (response.responseType === "SUBCATEGORIES") {
          setSubCategories(response.subcategories || []);
          // Try to derive name from first subcategory's parent ID or similar if available, 
          // or ideally, the API should return the parent category name. 
          // For now, we'll capitalize the ID or just use "Domestic Tours" as placeholder if name isn't available.
          // Note: The API response might need enhancement to send the parent category name explicitly.
          // We will use the categoryId from params as a fallback title.
          setCategoryName(categoryId);
          setLoading(false);
          return;
        }

        // TOUR
        if (response.responseType === "TOUR") {
          navigate(`/tours/${response.tour.catmasterId}`);
          return;
        }

        setError("Invalid response from server");
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load category");
        setLoading(false);
      });
  }, [categoryId, navigate]);


  return (
    <div className="min-h-screen bg-gray-50 pt-20"> {/* pt-20 to account for fixed navbar */}

      {/* Header Section */}
      <div className="bg-emerald-500 text-white py-12 text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 capitalize">{categoryName} Tours</h1>
          <p className="text-emerald-100 text-lg">Explore our collection of {categoryName} tours</p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <nav className="text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="capitalize text-gray-800 font-medium">Tours</span>
          <span>›</span>
          <span className="capitalize text-emerald-600 font-medium">{categoryName}</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">

        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}

        {!loading && !error && subCategories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No subcategories found for this section.
          </div>
        )}

        {!loading && !error && subCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {subCategories.map(cat => (
              <CategoryCard key={cat.categoryId} category={cat} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
