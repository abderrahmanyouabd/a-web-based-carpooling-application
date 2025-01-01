import React from "react";

const Step7 = ({ setParams, params, handlePrevious, handleContinue}) => {

    const handlePriceIncrease = () => {
        setParams(prevParams => ({
            ...prevParams,
            price: prevParams.price + 1
        }));
    };
    
    const handlePriceDecrease = () => {
        if (params.price > 0) {
          setParams(prevParams => ({
            ...prevParams,
            price: prevParams.price - 1
          }));
        }
    };

    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Set your price per seat</h1>

            <div className="flex items-center mt-10 space-x-8 md:space-x-12">
                <button
                    onClick={handlePriceDecrease}
                    className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                >
                    -
                </button>
                
                <span className="text-6xl font-bold text-gray-700">
                    €{params.price}
                </span>

                <button
                    onClick={handlePriceIncrease}
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

export default Step7;