import React, { useState } from "react";

const CreateRide = () => {

    const [step, setStep] = useState(1);
    const [params, setParams] = useState({
        pickUp: '',
        dropOff: '',
        startTime: '',
        passengers: 1,
        price: 20,
    });

    const handleContinue = () => {
        if (step === 1 && params.pickUp) setStep(2);
        if (step === 2 && params.dropOff) setStep(3);
        if (step === 3 && params.startTime) setStep(4);
        if (step === 4 && params.passengers) setStep(5);
        if (step === 5 && params.price) console.log("User's input: ", params);

    }

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({ ...params, [name]: value });
    };

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

    const handlePassengersIncrease = () => {
        setParams(prevParams => ({
            ...prevParams,
            passengers: prevParams.passengers + 1
        }));
    };
    
    const handlePassengersDecrease = () => {
        if (params.passengers > 0) {
          setParams(prevParams => ({
            ...prevParams,
            passengers: prevParams.passengers - 1
          }));
        }
    };


    return (
        <div className="flex flex-col items-center mt-10">


            {step === 1 && (
                <>
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Where would you like to pick up passengers?</h1>

                    <input 
                        type="text"
                        id="pickUp"
                        name="pickUp"
                        value={params.pickUp}
                        onChange={handleParamChange}
                        placeholder="Enter the full address"
                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <button 
                        onClick={handleContinue}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </>
            )}

            {step === 2 && (
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

                    <button 
                        onClick={handleContinue}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </>
            )}

            {step === 3 && (
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

                    <button 
                        onClick={handleContinue}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </>
            )}

            {step === 4 && (
                <>
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 ml-12">How many passengers would you like to take?</h1>

                    <div className="flex items-center mt-10 space-x-28">
                        <button
                            onClick={handlePassengersDecrease}
                            className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                        >
                            -
                        </button>
                        
                        <span className="text-6xl font-bold text-gray-700">
                            {params.passengers}
                        </span>

                        <button
                            onClick={handlePassengersIncrease}
                            className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                        >
                            +
                        </button>
                    </div>

                    <button 
                        onClick={handleContinue}
                        className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </>
            )}

            {step === 5 && (
                <>
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Set your price per seat</h1>

                    <div className="flex items-center mt-10 space-x-28">
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

                    <button 
                        onClick={handleContinue}
                        className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Continue
                    </button>
                </>
            )}


            
            
        </div>
    )
}

export default CreateRide;