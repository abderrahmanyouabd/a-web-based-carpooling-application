import React, { useState } from "react";
import axios from "axios";


const Home = () => {
    const [params, setParams] = useState({
        leavingFrom: '',
        goingTo: '',
        date: 'Today',
        passengers: 1
    });

    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('');

    const handleParamChange = async (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });

        if (name === 'leavingFrom' || name === 'goingTo') {
            setActiveField(name);
            const query = value;
            if (query.length > 2){ // Start suggesting after 2 characters
                try {
                    const response = await axios.get(
                        'https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
                            params: { namePrefix: query },
                            headers: {
                                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                                'x-rapidapi-key': '4779843e96msh40fc95a3dcbef6cp17159bjsn01979ec25fa7'
                            }
                        }
                    );
                    setSuggestions(response.data.data);
                } catch (error) {
                    console.error("Error fetching suggestions: ", error);
                }
            } else {
                setSuggestions([]);
            }
        }
    };

    const handleSuggestionClick = (cityName) => {
        if (activeField === 'leavingFrom'){
            setParams({...params, leavingFrom: cityName });
        }else if (activeField === 'goingTo'){
            setParams({...params, goingTo: cityName });
        }

        setSuggestions([]);
    }

    const handleSearch = () => {
        console.log("User input values: ", params);
    }


    return (
        <div>
           
           <div className="flex justify-center items-center mt-10">
                <div className="flex bg-white p-4 rounded-lg shadow-lg relative">

                    <div className="relative">
                        <input 
                            type="text"
                            name="leavingFrom"
                            placeholder="Leaving From"
                            value={params.leavingFrom}
                            onChange={handleParamChange}
                            onFocus={() => setActiveField('leavingFrom')}
                            className="border border-gray-300 rounded-md p-2 w-48 mr-4"
                        />
                        {activeField === 'leavingFrom' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li 
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.name)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text"
                            name="goingTo"
                            placeholder="Going to"
                            value={params.goingTo}
                            onChange={handleParamChange}
                            onFocus={() => setActiveField('goingTo')}
                            className="border border-gray-300 rounded-md p-2 w-48 mr-4"
                        />
                        {activeField === 'goingTo' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li 
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.name)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        

                    </div>
                    

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