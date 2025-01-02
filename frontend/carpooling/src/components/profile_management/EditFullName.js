import React, { useState } from "react";


const EditFullName = ({toggleFullNamePopup, handleSave}) => {
    const [fullName, setFullName] = useState('');
    
    return (
        <div className="bg-white flex justify-center fixed inset-0 z-50">

            <div className="w-full max-w-lg h-auto p-8 relative">

                <div className="text-right">
                    <button 
                        onClick={toggleFullNamePopup}
                        className="text-3xl text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your full name?</h1>
                    
                    <input 
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <button 
                        onClick={() => handleSave('fullName', fullName)}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
}

export default EditFullName;