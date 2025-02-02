import React from "react";

const Step2 = ({ params, handleParamChange, activeField, suggestions, handleSuggestionClick, handleContinue, handlePrevious }) => {
    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Drop-Off</h1>

            <input 
                type="text"
                id="dropOff"
                name="dropOff"
                value={params.dropOff}
                onChange={handleParamChange}
                placeholder="Enter the full address"
                className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <div className="relative">
                {activeField === 'dropOff' && suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full md:w-48 max-h-48 overflow-auto mt-1">
                        {suggestions.map(city => (
                            <li 
                                key={city.id}
                                onClick={() => handleSuggestionClick(city.label, city.coordinates)}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                            >
                                {city.label}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex space-x-16 mt-5">
                    <button 
                        onClick={handlePrevious}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Previous
                    </button>

                    <button 
                        onClick={handleContinue}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </div>

            
            </div>
            
        </>
    );
}

export default Step2;