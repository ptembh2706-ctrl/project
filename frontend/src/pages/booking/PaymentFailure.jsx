import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || "Payment was unsuccessful";

  const handleRetry = () => {
    // Typically navigating back one step might be better, or to the payment page if we had the ID
    // For now, let's go back to home or history
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">

        {/* Header */}
        <div className="bg-red-50 p-8 text-center border-b border-red-100">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Failed</h1>
          <p className="text-gray-500">We couldn't process your transaction.</p>
        </div>

        <div className="p-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex gap-3 text-red-800 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <span className="font-bold block mb-1">Error Reason:</span>
              {error}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Troubleshooting Tips</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Check your internet connection.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Verify your card details and balance.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Contact your bank if the issue persists.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
