import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconButton, Snackbar, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Step1 from "./Step1";
import Step0 from "./Step0";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";

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
    const [journeyInfo, setJourneyInfo] = useState({
        distance: 0,
        duration: 0
    });
    const [open, setOpen] = useState(false);
    const [tripId, setTripId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const isMobile = useMediaQuery("(max-width:600px)");

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
                await createTripAndCalculateFare();
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
                 
                await createTripAndCalculateFare();
                setStep(7);
            } catch (error) {
                console.error("Unable to save the vehicle to the database: ", error);
            }
        }
        if (step === 7 && params.price) {
            try {
                const finalFareData = {
                    totalFare: params.price * params.numberOfAvailableSeat,
                    farePerSeat: params.price,
                };

                const response = await axios.post(
                    `http://localhost:8080/api/trips/${tripId}/finalize`,
                    finalFareData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("Trip finalized successfully: ", response.data);
                setOpen(true);
                setTimeout(() =>{
                    navigate(`/ride-detail/${response.data.id}`, { state: { ride: response.data}});
                }, 3000);

            } catch (error) {
                console.error("Error creating trip: ", error);
            }
            
            
        };
    }

    const createTripAndCalculateFare = async () => {
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
                arrivalTime: calculateArrivalTime(params.startTime, journeyInfo.duration)
            },
            distance: parseFloat(journeyInfo.distance), // for backend predicting price
            duration: journeyInfo.duration, 
            date: params.startTime.split("T")[0],
            time: params.startTime.split("T")[1],
            availableSeats: params.numberOfAvailableSeat,
            comment: "",
            stations: []
        };

        console.log("TripData: ", tripData);

        try {
            
            const createTripResponse = await axios.post('http://localhost:8080/api/trips/create', tripData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const tripId = Number(createTripResponse.data.id);
            setTripId(tripId);
            console.log("Trip created pendening status: ", createTripResponse.data);

            
            const fareResponse = await axios.post(
                `http://localhost:8080/api/trips/calculate-fare?tripId=${tripId}`,
                {}, // empty object as the request body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            console.log("Fare Response: ", fareResponse.data);

            const { totalFare, farePerSeat } = fareResponse.data;
            console.log("Fare calaculated: ", fareResponse.data);

            setParams((prevParams) => ({
                ...prevParams,
                price: farePerSeat
            }));    
            
        } catch (error) {
            console.error("Error creating trip: ", error);
        }        
    }

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        setVehicle(prevVehicle => ({ ...prevVehicle, [name]: value }));
    }

    const handlePrevious = async () => {
        if (step === 7 && params.price) {
            const vehicleExists = await isUserHasVehicle();
            if (vehicleExists){
                setStep(5)
            } else {
                setStep(6)
            }
        } else if (step > 1) {
            setStep(step - 1)
        }
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


    const handleJourneyInfoUpdate = (info) => {
        setJourneyInfo(info);
        console.log("Journey info updated: ", info);
    };

    const calculateArrivalTime = (departureTime, duration) => {
        const departureDate = new Date(departureTime);

        const [hours, minutes, seconds] = duration
            .match(/(\d+):(\d+):(\d+)/)
            .slice(1, 4)
            .map(Number);
        
        departureDate.setHours(departureDate.getHours() + hours);
        departureDate.setMinutes(departureDate.getMinutes() + minutes);
        departureDate.setSeconds(departureDate.getSeconds() + seconds);
        
        const arrivalTime = departureDate.toISOString();

        return arrivalTime.replace('.000Z', '');
    }


    return (
        <div className="flex flex-col items-center mt-10">
            
            {step === 0 && (
                <Step0 />
            )}

            {step === 1 && (
                <Step1 
                    params={params}
                    handleParamChange={handleParamChange}
                    activeField={activeField}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    handleContinue={handleContinue}
                />
            )}

            {step === 2 && (
                <Step2 
                    params={params}
                    handleParamChange={handleParamChange}
                    activeField={activeField}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    handleContinue={handleContinue}
                    handlePrevious={handlePrevious}
                />
            )}

            {step === 3 && startCoordinates && endCoordinates && (
                <Step3 
                    startCoordinates={startCoordinates}
                    endCoordinates={endCoordinates}
                    handleJourneyInfoUpdate={handleJourneyInfoUpdate}
                    handlePrevious={handlePrevious}
                    handleContinue={handleContinue}
                />
            )}

            {step === 4 && (
                <Step4 
                    params={params}
                    handleParamChange={handleParamChange}
                    handlePrevious={handlePrevious}
                    handleContinue={handleContinue}
                />
            )}

            {step === 5 && (
                <Step5 
                    params={params}
                    setParams={setParams}
                    handleContinue={handleContinue}
                    handlePrevious={handlePrevious}
                />
            )}

            {step === 6 && (
                <Step6 
                    vehicle={vehicle}
                    handleVehicleChange={handleVehicleChange}
                    handlePrevious={handlePrevious}
                    handleContinue={handleContinue}
                />
            )}

            {step === 7 && (
                <Step7 
                    params={params}
                    setParams={setParams}
                    handleContinue={handleContinue}
                    handlePrevious={handlePrevious}
                />
            )}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Ride has been created successfully"
                action={action}
                anchorOrigin={{
                    vertical: 'top', 
                    horizontal: 'center'
                }}
                ContentProps={{
                    sx: {
                        fontSize: '1rem',
                        padding: isMobile ? '4px 8px' : '8px 16px',
                    },
                }}
            />
   
        </div>
    );
};

export default CreateRide;