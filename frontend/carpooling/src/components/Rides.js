import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWalking } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';
import { FaCar } from "react-icons/fa";
import TripSearch from "./TripSearch";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";


const Rides = () => {
    const location = useLocation();
    const { leavingFrom, goingTo, date, passengers, searchResults } = location.state;
    const [sortBy, setSoryBy] = useState("");
    const [pickUpFilter, setPickUpFilter] = useState("");
    const navigate = useNavigate();

    const pickUpTimeRanges = {
        "before6": ["00:00", "06:00"],
        "6to12": ["06:00", "12:00"],
        "12to18": ["12:01", "18:00"],
        "after18": ["18:01", "23:59"]
    };
    
    const sortRides = (rides) => {

        if (pickUpFilter && pickUpTimeRanges[pickUpFilter]) {
            const [start, end] = pickUpTimeRanges[pickUpFilter];

            return rides.filter((ride) => {
                const [rideHours, rideMinutes] = ride.time.split(":").slice(0, 2).map(Number);
                const rideTime = `${rideHours.toString().padStart(2, '0')}:${rideMinutes.toString().padStart(2, '0')}`;
                return rideTime >= start && rideTime <= end;
            });
        }

        switch (sortBy) {
            case "price":
                return rides.sort((a, b) => a.farePerSeat.price - b.farePerSeat.price);
            case "departure":
                return rides.sort((a, b) => {
                    const [hoursA, minutesA] = a.time.split(":").slice(0, 2).map(Number);
                    const [hoursB, minutesB] = b.time.split(":").slice(0, 2).map(Number);

                    const dateA = new Date();
                    dateA.setHours(hoursA, minutesA);

                    const dateB = new Date();
                    dateB.setHours(hoursB, minutesB);

                    return dateA - dateB;
                })
                
            case "duration":
                return rides.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
            case "departurePoint":
                return rides.sort((a, b) => a.departureDistance - b.departureDistance);
            case "arrivalPoint":
                return rides.sort((a, b) => a.arrivalDistance - b.arrivalDistance);

            default:
                return rides;
        }
    };

    const handleRideClick = (ride) => {
        navigate("/ride-detail", {state: {ride} });
    }

    const sortedRides = sortRides(searchResults);
       

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                <TripSearch initialParams={{ leavingFrom, goingTo, date, passengers }}/>
            </div>
            
            <div className="flex bg-gray-100">
                <Sidebar setSoryBy={setSoryBy} setPickUpFilter={setPickUpFilter} />

                <div className="w-3/4 p-4">
                    
                    <div className="flex justify-between items-center p-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">{date}</h2>
                            <p className="text-gray-600">{leavingFrom} → {goingTo}</p>
                            <div className="text-gray-800">{searchResults.length} rides available with {passengers} passengers</div>
                        </div>
                        
                    </div>
                       


                    <div className="overflow-auto h-[40rem] p-4">
                        {sortedRides.map((ride) => (
                            <div
                                key={ride.id}
                                onClick={() => handleRideClick(ride)}
                                className="bg-white border rounded-lg p-4 mb-4 shadow-lg flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-200"
                            >   

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">  
                                        <div>
                                            <p className="text-lg font-semibold">{ride.time}</p>
                                        </div>
                                        <AiOutlineArrowRight className="text-xl mx-4" />
                                        <div>
                                            <p className="text-lg font-semibold">{ride.goingTo.arrivalTime || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="relative mx-6 flex items-center w-full">

                                        <div className="relative w-full flex items-center justify-between mx-2">
                                            {/* Left part of the line */}
                                            <div className="flex-1 h-[2px] bg-gray-300 relative">
                                                <div className="absolute left-0 top-[-6px] w-[10px] h-[10px] rounded-full bg-teal-600"></div>
                                            </div>

                                            <p className="mx-4 text-gray-500 text-sm whitespace-nowrap">{ride.duration}</p>

                                            {/* Right part of the line */}
                                            <div className="flex-1 h-[2px] bg-gray-300 relative">
                                                <div className="absolute right-0 top-[-6px] w-[10px] h-[10px] rounded-full bg-teal-600"></div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="text-right">
                                        <p className="text-lg font-semibold">{ride.leavingFrom.name}</p>
                                        <p className="text-lg font-semibold">{ride.goingTo.name}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                        <FaWalking className="text-green-500" />
                                        <span>{ride.walking} walking</span>
                                    </div>

                                    <div className="flex items-center">
                                        <MdAttachMoney className="text-xl text-green-500" />
                                        <p className="text-2xl font-bold">{ride.farePerSeat}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center space-x-4">
                                        <FaCar className="text-2xl text-gray-500" />

                                        <img 
                                            src={ride.profileImage} 
                                            alt="profile" 
                                            className="w-10 h-10 rounded-full border"
                                        />
                                        <span className="font-semibold">{ride.driver.fullName}</span>
                                    </div>
                                    {ride.instantBooking && (
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <span className="mr-1">⚡</span> Instant Booking
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Rides;
