import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapRouteDrawing from "./MapRouteDrawing";
import { IconButton, Snackbar, TextField, MenuItem} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CreateRide = () => {

    const [step, setStep] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('');
    const [startCoordinates, setStartCoordinates] = useState([]);
    const [endCoordinates, setEndCoordinates] = useState([]);
    const [params, setParams] = useState({
        pickUp: '',
        dropOff: '',
        startTime: '',
        numberOfAvailableSeat: 1,
        price: 20,
    });
    const [vehicle, setVehicle] = useState({
        model: '',
        color: '',
        licensePlateNumber: '',
        brand: '',
        gasType: ''
    });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        if (token) {
            console.log("Yes user")
            setStep(1);
        } else {
            console.log("No user")
            setStep(0);
        }
    }, [])

    const isUserHasVehicle = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const vehicleResponse = await axios.get('http://localhost:8080/api/vehicle', 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            console.log("Vehicle data: ", vehicleResponse.data);
            console.log("Vehicle exists: ", Object.keys(vehicleResponse.data).length > 0);
            return vehicleResponse.data != null && Object.keys(vehicleResponse.data).length > 0;
        } catch (error) {
            console.error("Unable to fetch vehicle data: ", error);
            return false;
        }
    }

    const handleContinue = async () => {
        
        if (step === 1 && params.pickUp) setStep(2);
        if (step === 2 && params.dropOff) setStep(3);
        if (step === 3 && startCoordinates && endCoordinates) setStep(4);
        if (step === 4 && params.startTime) setStep(5);
        if (step === 5 && params.numberOfAvailableSeat) {
            const vehicleExists = await isUserHasVehicle();
            if (vehicleExists){
                setStep(7)
            } else {
                setStep(6)
            }
        };
        if (step === 6 && vehicle) {
            try {
                const token = localStorage.getItem('jwtToken');
                const vehicleResponse = await axios.post('http://localhost:8080/api/vehicle', 
                    vehicle,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log("Vehicle created successfully: ", vehicleResponse.data);
                setStep(7);
            } catch (error) {
                console.error("Unable to save the vehicle to the database: ", error);
            }
        }
        if (step === 7 && params.price) {
            console.log("User's input: ", params);

            const tripData = {
                leavingFrom: {
                    name: params.pickUp,
                    location: params.pickUp,
                    longitude: startCoordinates[0].toString(),
                    latitude: startCoordinates[1].toString(),
                    departureTime: params.startTime,
                    arrivalTime: ""
                },
                goingTo: {
                    name: params.dropOff,
                    location: params.dropOff,
                    longitude: endCoordinates[0].toString(),
                    latitude: endCoordinates[1].toString(),
                    departureTime: "",
                    arrivalTime: "",
                },
                date: params.startTime.split("T")[0],
                time: params.startTime.split("T")[1],
                availableSeats: params.numberOfAvailableSeat,
                farePerSeat: params.price,
                comment: "",
                stations: []
            };

            const token = localStorage.getItem('jwtToken');

            console.log("Token: " + token);

            try {
                const response = await axios.post('http://localhost:8080/api/trips/create', tripData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Trip created successfully: ", response.data);
                setOpen(true);
                setTimeout(() =>{
                    navigate(`/ride-detail/${response.data.id}`, { state: { ride: response.data}});
                }, 3000);
            } catch (error) {
                console.error("Error creating trip: ", error);
            }
            
            
        };
    }

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        setVehicle(prevVehicle => ({ ...prevVehicle, [name]: value }));
    }

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    }

    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setOpen(false)}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    )


    const handleParamChange = async (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });

        if (name === 'pickUp' || name === 'dropOff') {
            setActiveField(name);
            const query = value;
            if (query.length > 2){ // Start suggesting after 2 characters
                try {
                    const response = await axios.get(
                        'https://api.openrouteservice.org/geocode/autocomplete', {
                            params: { 
                                api_key: '5b3ce3597851110001cf6248e4896a13b7cd44c988adeba2a1f425b4',
                                text: query,
                                layers: 'address,locality,country,region,county'
                            }
                        }
                    );

                    const citySuggestions = response.data.features.map(feature => ({
                        id: feature.properties.id,
                        label: feature.properties.label,
                        coordinates: feature.geometry.coordinates
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

    const handleSuggestionClick = (cityName, coordinate) => {
        if (activeField === 'pickUp'){
            setParams({...params, pickUp: cityName });
            setStartCoordinates(coordinate);
        }else if (activeField === 'dropOff'){
            setParams({...params, dropOff: cityName });
            setEndCoordinates(coordinate);
        }

        console.log("Coordinates: " + coordinate);
        setSuggestions([]);
    }

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
        <div className="flex flex-col items-center mt-10">
            
            {step === 0 && (
                <>
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-16">How do you want to log in?</h1>
                    <div className="w-full max-w-xs">
                        <button
                            onClick={() => navigate("/signin")}
                            className="flex items-center justify-between w-full px-4 py-3 mb-8 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            <span>Continue with email</span>
                            <span>&gt;</span>
                        </button>
                        <button
                            className="flex items-center justify-between w-full px-4 py-3 mb-8 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            <span>Continue with Facebook</span>
                            <span className="text-blue-600">&gt;</span>
                        </button>
                        <div className="text-center text-gray-500 mt-4">
                            Not a member yet?{" "}
                            <button 
                                onClick={() => navigate("/signup")}
                                className="text-blue-500 hover:underline"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </>
            )}

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
                        className="font-bold mt-10 mb-5 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <div className="relative">
                        {activeField === 'pickUp' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full md:w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.label, city.coordinates)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        <button 
                            onClick={handleContinue}
                            className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600 z-0"
                        >
                            Continue
                        </button>
                    </div>

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
                    <div className="relative">
                        {activeField === 'dropOff' && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full md:w-48 max-h-48 overflow-auto mt-1">
                                {suggestions.map(city => (
                                    <li 
                                        key={city.id}
                                        onClick={() => handleSuggestionClick(city.label, city.coordinates)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city.label}
                                    </li>
                                ))}
                            </ul>
                        )}

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

                       
                    </div>
                    
                </>
            )}

            {step === 3 && startCoordinates && endCoordinates && (

                <>
                    <div className="w-full max-w-3xl">
                        <MapRouteDrawing startCoordinates={startCoordinates} endCoordinates={endCoordinates} />
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
                
                
            )}

            {step === 4 && (
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
            )}

            {step === 5 && (
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
            )}

            {step === 6 && (
                <>
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Enter Vehicle Details</h1>
                    <div className="flex flex-col space-y-4 mt-5">
                        <TextField
                            label="Model"
                            name="model"
                            value={vehicle.model}
                            onChange={handleVehicleChange}
                            variant="outlined"
                        />
                        <TextField
                            label="Color"
                            name="color"
                            value={vehicle.color}
                            onChange={handleVehicleChange}
                            variant="outlined"
                        />
                        <TextField
                            label="License Plate Number"
                            name="licensePlateNumber"
                            value={vehicle.licensePlateNumber}
                            onChange={handleVehicleChange}
                            variant="outlined"
                        />
                        <TextField
                            label="Brand"
                            name="brand"
                            value={vehicle.brand}
                            onChange={handleVehicleChange}
                            variant="outlined"
                        />
                        <TextField
                            select
                            label="Gas Type"
                            name="gasType"
                            value={vehicle.gasType}
                            onChange={handleVehicleChange}
                            variant="outlined"
                        >
                            <MenuItem value="GASOLINE">Gasoline</MenuItem>
                            <MenuItem value="DIESEL">Diesel</MenuItem>
                        </TextField>
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
            )}

            {step === 7 && (
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
            )}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Ride has been created successfully"
                action={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                ContentProps={{
                    sx: {
                        fontSize: '1rem'
                    },
                }}
            />


   
        </div>
    );
};

export default CreateRide;