import React, { useState } from "react";


const Home = () => {
    const [params, setParams] = useState({
        leavingFrom: '',
        goingTo: '',
        date: 'Today',
        passengers: 1
    });

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });
    };

    const handleSearch = () => {
        console.log("User input values: ", params);
    }


    return (
        <div>
           
           <div className="flex justify-center items-center mt-10">
                <div className="flex bg-white p-4 rounded-lg shadow-lg">
                    <input 
                        type="text"
                        name="leavingFrom"
                        placeholder="Leaving From"
                        value={params.leavingFrom}
                        onChange={handleParamChange}
                        className="border border-gray-300 rounded-md p-2 w-48 mr-4"
                    />

                    <input 
                        type="text"
                        name="goingTo"
                        placeholder="Going to"
                        value={params.goingTo}
                        onChange={handleParamChange}
                        className="border border-gray-300 rounded-md p-2 w-48 mr-4"
                    />

                    <input 
                        type="date"
                        name="date"
                        value={params.date}
                        onChange={handleParamChange}
                        className="border border-gray-300 rounded-md p-2 w-48 mr-4"
                    />

                    <select
                        name="passengers"
                        value={params.passengers}
                        onChange={handleParamChange}
                        className="border border-gray-300 rounded-md p-2 w-32 mr-4"
                    >
                        <option value="1">1 Passenger</option>
                        <option value="2">2 Passengers</option>
                        <option value="3">3 Passengers</option>
                        <option value="4">4 Passengers</option>
                    </select>

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
                    >
                        Search
                    </button>
                </div>
                
           </div>
        </div>
    )
}

export default Home;