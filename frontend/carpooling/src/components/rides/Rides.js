import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaRoute } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { FaCar } from "react-icons/fa";
import TripSearch from "../TripSearch";
import RideSortBySidebar from "./RideSortBySidebar";
import { useNavigate } from "react-router-dom";


const Rides = () => {
    const location = useLocation();
    const { leavingFrom, goingTo, date, numberOfAvailableSeat, searchResults } = location.state;
    const [filters, setFilters] = useState({ sortBy: "", pickUpTime: ""});
    const navigate = useNavigate();

    const pickUpTimeRanges = {
        "before6": ["00:00", "06:00"],
        "6to12": ["06:00", "12:00"],
        "12to18": ["12:01", "18:00"],
        "after18": ["18:01", "23:59"]
    };
    
    const sortRides = (rides) => {
        const { sortBy, pickUpTime } = filters;

        let filteredRides = [...rides];

        // Apply Pick-up Time Filter if selected
        if (pickUpTime && pickUpTimeRanges[pickUpTime]) {
            const [start, end] = pickUpTimeRanges[pickUpTime];

            filteredRides = filteredRides.filter((ride) => {
                const [rideHours, rideMinutes] = ride.time.split(":").slice(0, 2).map(Number);
                const rideTime = `${rideHours.toString().padStart(2, '0')}:${rideMinutes.toString().padStart(2, '0')}`;
                return rideTime >= start && rideTime <= end;
            });
        }

        // Apply Sorting if selected
        if (sortBy) {
            filteredRides = [...filteredRides].sort((a, b) => {
                switch (sortBy) {
                    case "price":
                        return a.farePerSeat - b.farePerSeat;
                    case "departure":
                        const [hoursA, minutesA] = a.time.split(":").slice(0, 2).map(Number);
                        const [hoursB, minutesB] = b.time.split(":").slice(0, 2).map(Number);
        
                        const dateA = new Date().setHours(hoursA, minutesA);
                        const dateB = new Date().setHours(hoursB, minutesB);
        
                        return dateA - dateB;
                    case "duration":
                        return parseInt(a.duration) - parseInt(b.duration);
                    case "distance":
                        return a.distance - b.distance;
                    case "availableSeats":
                        return b.availableSeats - a.availableSeats; // Descending orders
                    default:
                        return 0;
                }
            });
        }
        

        return filteredRides;
    };

    const handleRideClick = (ride) => {
        navigate(`/ride-detail/${ride.id}`, {state: {ride} });
    }

    const sortedRides = sortRides(searchResults.filter(ride => ride.status === "PLANNED"));

    const getTimePart = (datetime) =>{
        if(!datetime) return "";
        const timePart = datetime.split("T")[1];
        return timePart;
    }

    const formatDuration = (duration) => {
        const [hours, minutes, ] = duration.split(':').map(Number);
        const formattedHours = hours ? `${hours}h`: '';
        const formattedMinutes = minutes ? ` ${minutes}m `: '';

        return `${formattedHours}${formattedMinutes}`.trim();
    }
       

    return (
        <div className="relative bg-gray-200">
            <div className="flex-grow absolute inset-0 bg-[url('https://miro.medium.com/v2/resize:fit:1400/1*n-6mh-5LUdlePB0H1u776Q.jpeg')] opacity-[.03]"></div> {/* Subtle background pattern */}

            <div className="mx-auto px-6 py-8 relative">
                <TripSearch initialParams={{ leavingFrom, goingTo, date, numberOfAvailableSeat }}/>
            </div>
            
            <div className="relative flex flex-col md:flex-row justify-center md:space-x-8">
                <RideSortBySidebar filters={filters} setFilters={setFilters}/>

                <div className="w-full md:w-auto">

                    {/*Search parameters */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:ml-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">{date}</h2>
                            <p className="text-gray-600">{leavingFrom} → {goingTo}</p>
                            <div className="text-gray-800">{searchResults.length} rides available with minimum {numberOfAvailableSeat} available seat(s) </div>
                        </div>
                        
                    </div>

                    {/* Ride Cards*/}
                    <div className="overflow-y-auto min-h-[700px] max-h-[800px] w-full md:w-[50rem]">
                        {sortedRides.length > 0 ? (
                            sortedRides.map((ride) => (
                                <div
                                    key={ride.id}
                                    onClick={ride.availableSeats > 0 ? () => handleRideClick(ride) : null}
                                    className={`bg-white border rounded-2xl p-5 mb-5 shadow-md flex flex-col space-y-5 transition duration-200 cursor-pointer
                                        ${ride.availableSeats === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
                                >   

                                    {ride.availableSeats === 0 && (
                                            <div className="text-center bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                FULL
                                            </div>
                                    )}
                                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                        
                                        <div className="flex items-center justify-center w-full md:w-auto space-x-5">  
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
                                            <FaRoute className="text-green-500" />
                                            <span>{ride.distance} km</span>
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
                                            <span className="font-semibold">{ride.driver?.fullName}</span>
                                            
                                            <div className="w-px h-6 bg-gray-400"></div>
                                            <div>Avail.Seat: {ride.availableSeats}</div>
                                        </div>
                                        
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center rounded-lg p-6">
                                <FaCar className="text-4xl text-gray-500 mb-3" />
                                <p className="text-gray-700 text-lg font-semibold">No rides found</p>
                                <p className="text-gray-500">Try adjusting your filters or searching for a different date.</p>
                            </div>
                        )}
                    </div>

                </div>
                
            </div>
        </div>
        
    );
};

export default Rides;
