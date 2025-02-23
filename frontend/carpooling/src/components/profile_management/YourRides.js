import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const YourRides = () => {
    const [selectedTab, setSelectedTab] = useState("created");
    const [rides, setRides] = useState([]);
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    const handleRideClick = (ride) => {
        navigate(`/ride-detail/${ride.id}`, {state: {ride} });
    }

    useEffect(() => {
        const fetchRides = async () => {
            const apiUrl = selectedTab === "created" 
                ? `${BACKEND_API_BASE_URL}/api/trips/created` 
                : `${BACKEND_API_BASE_URL}/api/trips/joined`;

            try {

                if (!token) {
                    console.log("User is not logged in. Navigating to sign in page...");
                    navigate("/signin");
                    return;
                }

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const ridesData = await response.json();
                    console.log("Your rides: ", response.data);
                    const sortedRides = ridesData.sort((a, b) => 
                        new Date(b.leavingFrom.departureTime) - new Date(a.leavingFrom.departureTime)
                    );
                    setRides(sortedRides);
                } else {
                    console.error("Failed to fetch rides data.");
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchRides();
    }, [selectedTab, token, navigate]);


    return (

        <div>

            <div className="flex justify-center bg-white">
                <div className="flex flex-col md:flex-row py-4">
                    <button
                        className={`text-lg font-semibold px-4 py-2 md:px-[167px] ${
                            selectedTab === "created" ? "text-teal-700 border-b-4 border-teal-700 bg-yellow-500 rounded-lg" : "text-gray-500"
                        }`}
                        onClick={() => setSelectedTab("created")}
                    >
                        Created Ride
                    </button>

                    <button
                        className={`text-lg font-semibold px-4 py-2 md:px-[167px] ${
                            selectedTab === "joined" ? "text-teal-700 border-b-4 border-teal-700 bg-yellow-500 rounded-lg" : "text-gray-500"
                        }`}
                        onClick={() => setSelectedTab("joined")}
                    >   
                        Joined Ride
                    </button>
                </div>
            </div>


            <div className="flex justify-center py-8 px-4 md:px-0">

                {rides.length > 0 ? (
                    <div className="w-full max-w-lg md:max-w-4xl">

                        <h1 className="text-2xl font-bold text-center mb-6">
                            {selectedTab === "created" ? "Your Created Rides" : "Your Joined Rides"}
                        </h1>
                        <div className="space-y-4">

                            {rides.map((ride) => (
                                <div
                                    key={ride.id}
                                    className="flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                                    onClick={() => handleRideClick(ride)}
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                        {ride.driver.profilePicture ? (
                                            <img 
                                                src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-full" 
                                            />
                                        ) : (
                                            <img 
                                                src={
                                                    ride.driver.gender === "FEMALE"
                                                        ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                                        : ride.driver.gender === "MALE"
                                                            ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                            : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                                }
                                                alt="Default Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )}

                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {ride.leavingFrom.name} → {ride.goingTo.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Departure: {new Date(ride.leavingFrom.departureTime).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Arrival: {new Date(ride.goingTo.arrivalTime).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Price: {ride.farePerSeat != null ?
                                                `€${ride.farePerSeat.toFixed(2)} per seat`
                                                : 'Price not available'} 
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-6">
                            {selectedTab === "created" 
                                ? "You haven't created any rides yet."
                                : "You haven't joined any rides yet."
                            }    
                        </h1>
                        <p className="text-sm text-center">
                            {selectedTab === "created"
                                ? "You can book rides by clicking on the 'Create Ride' button."
                                : "Browse and join rides to see them here."
                            }  
                        </p>
                        {selectedTab === "created" && (
                            <div className="flex justify-center mt-8">
                                <button
                                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                                    onClick={() => navigate("/create-ride")}
                                >
                                    Create a Ride
                                </button>
                            </div>
                        )}
                        
                    </div>
                )}    
            </div>

        </div>
    );
}

export default YourRides;