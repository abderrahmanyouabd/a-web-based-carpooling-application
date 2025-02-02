import React from "react";

const Step4 = ({params, handleParamChange, handlePrevious, handleContinue}) => {
    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">When are you going?</h1>

            <input 
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={params.startTime}
                onChange={handleParamChange}
                className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

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
            
        </>
    )
}

export default Step4;