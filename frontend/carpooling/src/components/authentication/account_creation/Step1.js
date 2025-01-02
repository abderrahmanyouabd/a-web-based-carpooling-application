import React from "react";

const Step1 = ({ params, handleParamChange, handleContinue}) => {
    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your email address?</h1>

            <input 
                type="text"
                id="email"
                name="email"
                value={params.email}
                onChange={handleParamChange}
                placeholder="Email"
                className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <button 
                onClick={handleContinue}
                className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
            >
                Continue
            </button>
        </>
    );
}

export default Step1;