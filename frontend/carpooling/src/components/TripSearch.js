import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GEO_AUTOCOMPLETE_API_KEY = process.env.REACT_APP_GEO_AUTOCOMPLETE_API_KEY;
const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const TripSearch = ({ initialParams = {} }) => {

    const [params, setParams] = useState({
        leavingFrom: initialParams.leavingFrom || '',
        goingTo: initialParams.goingTo ||'',
        date: initialParams.date || '',
        numberOfAvailableSeat: initialParams.numberOfAvailableSeat || '1',
    });

    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleParamChange = async (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });

        if (name === 'leavingFrom' || name === 'goingTo') {
            setActiveField(name);
            const query = value;
            if (query.length > 2){ // Start suggesting after 2 characters
                try {
                    const response = await axios.get(
                        'https://api.openrouteservice.org/geocode/autocomplete', {
                            params: { 
                                api_key: GEO_AUTOCOMPLETE_API_KEY,
                                text: query,
                                layers: 'address,locality,country,region,county'
                            }
                        }
                    );

                    const citySuggestions = response.data.features.map(feature => ({
                        id: feature.properties.id,
                        label: feature.properties.label
                    }));

                    setSuggestions(citySuggestions);
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

    const handleSearch = async () => {
        console.log("User input values: ", params);
        try {
            const requestParams = {};
            if (params.leavingFrom) requestParams.leavingFrom = params.leavingFrom;
            if (params.goingTo) requestParams.goingTo = params.goingTo;
            if (params.date) requestParams.date = params.date;
            if (params.numberOfAvailableSeat) requestParams.numberOfAvailableSeat = params.numberOfAvailableSeat;
            
            let url = `${BACKEND_API_BASE_URL}/api/trips/search?`;
            if(requestParams.leavingFrom){
                url += `leavingFrom=${requestParams.leavingFrom.replace(/,\s+/g, ',+')}&`;
            }
            if(requestParams.goingTo){
                url += `goingTo=${requestParams.goingTo.replace(/,\s+/g, ',+')}&`;
            }
            
            console.log("Request URL: ", url);
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setErrorMessage("");
            console.log("Result: ", response.data);

            navigate("/rides", {
                state: {
                    leavingFrom: params.leavingFrom,
                    goingTo: params.goingTo,
                    date: params.date,
                    numberOfAvailableSeat: params.numberOfAvailableSeat,
                    searchResults: response.data
                }
            });
        } catch (error) {
            console.error("Error searching trips: ", error);
            setErrorMessage("Error searching trips. Please try again later.");
        }


        console.log("Error Message: ", errorMessage);
        
    }

    return (
        <div className="flex justify-center items-center">
                <div className="flex flex-col md:flex-row bg-white p-4 gap-2 md:gap-4 rounded-lg w-full shadow-lg md:w-auto">

                    <div className="relative mb-4 w-full md:mb-0">
                        <input 
                            type="text"
                            name="leavingFrom"
                            placeholder="Leaving From"
                            value={params.leavingFrom}
                            onChange={handleParamChange}
                            onFocus={() => setActiveField('leavingFrom')}
                            className="border border-gray-300 rounded-md p-2 w-full md:w-48"
                        />
                        {activeField === 'leavingFrom' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full md:w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li 
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.label)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                    </div>
                    
                    <div className="relative mb-4 w-full md:mb-0">
                        <input 
                            type="text"
                            name="goingTo"
                            placeholder="Going to"
                            value={params.goingTo}
                            onChange={handleParamChange}
                            onFocus={() => setActiveField('goingTo')}
                            className="border border-gray-300 rounded-md p-2 w-full md:w-48"
                        />
                        {activeField === 'goingTo' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full md:w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li 
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.label)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.label}
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
                        className="border border-gray-300 rounded-md p-2 w-full mb-4 md:w-48 md:mb-0 md:mr-4"
                    />

                    <select
                        name="availableSeat"
                        value={params.numberOfAvailableSeat}
                        onChange={handleParamChange}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-32 mb-4 md:mb-0 md:mr-4"
                    >
                        <option value="1">1 available seat</option>
                        <option value="2">2 available seats</option>
                        <option value="3">3 available seats</option>
                        <option value="4">4 available seats</option>
                    </select>

                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md w-full md:w-auto hover:bg-blue-600 transition-all duration-200"
                    >
                        Search
                    </button>
                    
                </div>
                
        </div>
    )
}

export default TripSearch;