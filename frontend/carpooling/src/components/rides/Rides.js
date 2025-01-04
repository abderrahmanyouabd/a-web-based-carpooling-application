import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWalking } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';
import { FaCar } from "react-icons/fa";
import TripSearch from "../TripSearch";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";


const Rides = () => {
    const location = useLocation();
    const { leavingFrom, goingTo, date, numberOfAvailableSeat, searchResults } = location.state;
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
        navigate(`/ride-detail/${ride.id}`, {state: {ride} });
    }

    const sortedRides = sortRides(searchResults);

    const getTimePart = (datetime) =>{
        if(!datetime) return "";
        const timePart = datetime.split("T")[1];
        return timePart;
    }

    const formatDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        const formattedHours = hours > 0 ? `${hours} hour${hours > 1 ? 's': ''} `: '';
        const formattedMinutes = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's': ''} `: '';

        return `${formattedHours}${formattedMinutes}`;
    }
       

    return (
        <div>
            <div className="mx-auto px-6 py-8">
                <TripSearch initialParams={{ leavingFrom, goingTo, date, numberOfAvailableSeat }}/>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center md:space-x-8">
                <Sidebar setSoryBy={setSoryBy} setPickUpFilter={setPickUpFilter} />

                <div className="w-full md:w-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:ml-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">{date}</h2>
                            <p className="text-gray-600">{leavingFrom} → {goingTo}</p>
                            <div className="text-gray-800">{searchResults.length} rides available with minimum {numberOfAvailableSeat} available seat(s) </div>
                        </div>
                        
                    </div>

                    <div className="overflow-auto h-auto w-full md:w-[50rem]">
                        {sortedRides.map((ride) => (
                            <div
                                key={ride.id}
                                onClick={ride.availableSeats > 0 ? () => handleRideClick(ride) : null}
                                className={`bg-white border rounded-lg p-4 mb-4 shadow-lg flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-200
                                    ${ride.availableSeats === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
                            >   

                                {ride.availableSeats === 0 && (
                                        <div className="text-center bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            FULL
                                        </div>
                                )}
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                    
                                    <div className="flex items-center justify-between w-full md:w-auto">  
                                        <div>
                                            <p className="text-lg font-semibold">{getTimePart(ride.leavingFrom.departureTime)}</p>
                                        </div>
                                        <AiOutlineArrowRight className="text-xl mx-4" />
                                        <div>
                                            <p className="text-lg font-semibold">{getTimePart(ride.goingTo.arrivalTime) || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="relative mx-6 flex items-center w-full">

                                        <div className="relative w-full flex items-center justify-between mx-2">
                                            {/* Left part of the line */}
                                            <div className="flex-1 h-[2px] bg-gray-300 relative">
                                                <div className="absolute left-0 top-[-6px] w-[10px] h-[10px] rounded-full bg-teal-600"></div>
                                            </div>

                                            <p className="mx-4 text-gray-500 text-sm whitespace-nowrap">
                                                {ride.duration != null ?
                                                    formatDuration(ride.duration)
                                                :
                                                    "No time available"
                                                }

                                            </p>

                                            {/* Right part of the line */}
                                            <div className="flex-1 h-[2px] bg-gray-300 relative">
                                                <div className="absolute right-0 top-[-6px] w-[10px] h-[10px] rounded-full bg-teal-600"></div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="flex flex-col items-center md:text-right md:block">
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
                                        <p className="text-2xl font-bold">€{ride.farePerSeat}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center space-x-4">
                                        <FaCar className="text-2xl text-gray-500" />

                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                            {ride.driver?.profilePicture ? ( 
                                                <img 
                                                    src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                                    alt="Profile Picture" 
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
                                                    alt="Default Profile Picture"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            )}
                                        </div>
                                        <span className="font-semibold">{ride.driver?.fullName}</span>
                                        
                                        <div className="w-px h-6 bg-gray-400"></div>
                                        <div>Avail.Seat: {ride.availableSeats}</div>
                                    </div>
                                    
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
