import React from "react";

const Step1 = ({ params, handleParamChange, activeField, suggestions, handleSuggestionClick, handleContinue}) => {
    
    return (
        <>
            <h1 className="text-xl md:text-3xl text-center font-extrabold text-gray-700">Where would you like to pick up passengers?</h1>

            <input 
                type="text"
                id="pickUp"
                name="pickUp"
                value={params.pickUp}
                onChange={handleParamChange}
                placeholder="Enter the full address"
                className="font-bold mt-10 mb-5 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="relative">
                {activeField === 'pickUp' && suggestions.length > 0 && (
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
                
                <button 
                    onClick={handleContinue}
                    className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600 z-0"
                >
                    Continue
                </button>
            </div>

        </>
    )
}

export default Step1;