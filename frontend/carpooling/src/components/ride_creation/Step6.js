import React from "react";

const Step5 = ({setParams, params, handlePrevious, handleContinue}) => {

    const handlePassengersIncrease = () => {
        setParams(prevParams => ({
            ...prevParams,
            numberOfAvailableSeat: prevParams.numberOfAvailableSeat + 1
        }));
    };
    
    const handlePassengersDecrease = () => {
        if (params.numberOfAvailableSeat > 0) {
          setParams(prevParams => ({
            ...prevParams,
            numberOfAvailableSeat: prevParams.numberOfAvailableSeat - 1
          }));
        }
    };

    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 text-center">How many passengers would you like to take?</h1>
            
            <div className="flex items-center mt-10 space-x-14 md:space-x-28">
                <button
                    onClick={handlePassengersDecrease}
                    className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                >
                    -
                </button>
                
                <span className="text-6xl font-bold text-gray-700">
                    {params.numberOfAvailableSeat}
                </span>

                <button
                    onClick={handlePassengersIncrease}
                    className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                >
                    +
                </button>
            </div>

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

export default Step5;