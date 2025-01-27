import React, { useState } from "react";

const Step7 = ({ setParams, params, handlePrevious, handleContinue}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(params.price);

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

    const handleEditToggle = () => {
        setEditValue(params.price);
        setIsEditing((prev) => !prev);
    };

    const handleEditConfirm = () => {
        const newPrice = Math.max(0, parseFloat(editValue, 10) || 0); // Ensure a valid number and non-negative
        setParams((prevParams) => ({
            ...prevParams,
            price: newPrice,
        }));
        setIsEditing(false);
    }

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
                
                {isEditing ? (
                    <input 
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-64 text-6xl font-bold text-gray-700 text-center border border-gray-300 rounded-lg p-2"
                    />

                ) : (
                    <span className="text-6xl font-bold text-gray-700">
                        €{params.price}
                    </span>
                )}
                

                <button
                    onClick={handlePriceIncrease}
                    className="text-blue-500 border border-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2"
                >
                    +
                </button>
            </div>

            <div className="flex space-x-4 mt-4">
                <button
                    onClick={isEditing ? handleEditConfirm : handleEditToggle}
                    className={`text-sm px-3 py-1 rounded-lg ${
                        isEditing
                            ? "text-white bg-blue-500 hover:bg-blue-600"
                            : "text-blue-500 border border-blue-500 hover:bg-blue-100"
                    }`}
                >   
                    {isEditing? "Confirm" : "Edit"}
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