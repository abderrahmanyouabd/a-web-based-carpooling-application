import React from "react";

const Step5 = ({params, handleParamChange, handleContinue}) => {
    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-10">Define your password</h1>

            <p className="p-8 text-gray-500">It must have at least 8 characters, 1 letter, 1 number and 1 special character.</p>
            <input 
                type="password"
                id="password"
                name="password"
                value={params.password}
                onChange={handleParamChange}
                placeholder="Password"
                className="font-bold mt-5 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {params.password && (
                <button 
                    onClick={handleContinue}
                    className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Continue
                </button>
            )}
        </>
    )
}

export default Step5;