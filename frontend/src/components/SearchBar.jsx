import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minBudget, setMinBudget] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [minDays, setMinDays] = useState('');
    const [maxDays, setMaxDays] = useState('');

    const handleSearch = () => {
        onSearch({
            query,
            startDate,
            endDate,
            minBudget,
            maxBudget,
            minDays,
            maxDays
        });
    };

    const handleClear = () => {
        setQuery('');
        setStartDate('');
        setEndDate('');
        setMinBudget('');
        setMaxBudget('');
        setMinDays('');
        setMaxDays('');
        onSearch({
            query: '',
            startDate: '',
            endDate: '',
            minBudget: '',
            maxBudget: '',
            minDays: '',
            maxDays: ''
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 max-w-6xl mx-auto -mt-32 relative z-30 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                </span>
                Find Your Perfect Tour
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Destination */}
                <div className="col-span-1 md:col-span-4 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Destination</label>
                    <input
                        type="text"
                        placeholder="Where do you want to go?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Dates */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">From Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">To Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Duration */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Duration (Days)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minDays}
                            onChange={(e) => setMinDays(e.target.value)}
                            className="w-1/2 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxDays}
                            onChange={(e) => setMaxDays(e.target.value)}
                            className="w-1/2 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Budget */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Budget (₹)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Budget"
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                            className="w-1/2 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Max Budget"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="w-1/2 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>


                {/* Search Button */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex items-end gap-3">
                    <button
                        onClick={handleClear}
                        className="bg-gray-100 text-gray-600 px-6 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-200 transition shadow-sm border border-gray-200 flex items-center justify-center gap-2"
                        title="Clear filters"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button
                        onClick={handleSearch}
                        className="flex-grow bg-emerald-600 text-white p-3.5 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search Tours
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
