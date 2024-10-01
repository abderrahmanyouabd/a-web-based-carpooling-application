import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWalking } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';
import { FaCar } from "react-icons/fa";
import TripSearch from "./TripSearch";
import Sidebar from "./Sidebar";

const fakeRides = [
    { 
        id: 1, 
        departureTime: "17:00", 
        duration: "3h 10m", 
        arrivalTime: "20:10", 
        from: "Luton", 
        to: "Manchester", 
        price: "£21.79", 
        walking: "10 mins", 
        departureDistance: 10,  
        arrivalDistance: 10,  
        pickUpTimeWindow: "12:01 - 18:00",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg", 
        profileName: "Muhammad",
        instantBooking: true
    },
    { 
        id: 2, 
        departureTime: "08:30", 
        duration: "4h 15m", 
        arrivalTime: "12:45", 
        from: "London", 
        to: "Birmingham", 
        price: "£18.50", 
        walking: "5 mins", 
        departureDistance: 5,
        arrivalDistance: 5,
        pickUpTimeWindow: "12:01 - 18:00",
        profileImage: "https://randomuser.me/api/portraits/women/45.jpg", 
        profileName: "Aisha",
        instantBooking: false
    },
    { 
        id: 3, 
        departureTime: "14:20", 
        duration: "2h 50m", 
        arrivalTime: "17:10", 
        from: "Leeds", 
        to: "Liverpool", 
        price: "£25.00", 
        walking: "8 mins", 
        departureDistance: 8,
        arrivalDistance: 8,
        pickUpTimeWindow: "12:01 - 18:00",
        profileImage: "https://randomuser.me/api/portraits/men/65.jpg", 
        profileName: "Oliver",
        instantBooking: true
    },
    { 
        id: 4, 
        departureTime: "09:45", 
        duration: "5h 30m", 
        arrivalTime: "15:15", 
        from: "Edinburgh", 
        to: "Glasgow", 
        price: "£12.99", 
        walking: "15 mins", 
        departureDistance: 15,
        arrivalDistance: 15,
        pickUpTimeWindow: "06:00 - 12:00",
        profileImage: "https://randomuser.me/api/portraits/women/21.jpg", 
        profileName: "Emily",
        instantBooking: false
    },
    { 
        id: 5, 
        departureTime: "13:00", 
        duration: "1h 45m", 
        arrivalTime: "14:45", 
        from: "Bristol", 
        to: "Bath", 
        price: "£9.50", 
        walking: "12 mins", 
        departureDistance: 12,
        arrivalDistance: 12,
        pickUpTimeWindow: "12:01 - 18:00",
        profileImage: "https://randomuser.me/api/portraits/men/18.jpg", 
        profileName: "James",
        instantBooking: true
    },
    { 
        id: 6, 
        departureTime: "11:15", 
        duration: "3h 30m", 
        arrivalTime: "14:45", 
        from: "Newcastle", 
        to: "York", 
        price: "£20.70", 
        walking: "7 mins", 
        departureDistance: 7,
        arrivalDistance: 7,
        pickUpTimeWindow: "06:01 - 12:00",
        profileImage: "https://randomuser.me/api/portraits/women/34.jpg", 
        profileName: "Sophie",
        instantBooking: true
    },
    { 
        id: 7, 
        departureTime: "06:45", 
        duration: "2h 20m", 
        arrivalTime: "09:05", 
        from: "Oxford", 
        to: "Cambridge", 
        price: "£15.90", 
        walking: "3 mins", 
        departureDistance: 3,
        arrivalDistance: 3,
        pickUpTimeWindow: "06:00 - 12:00",
        profileImage: "https://randomuser.me/api/portraits/men/50.jpg", 
        profileName: "Liam",
        instantBooking: false
    },
    { 
        id: 8, 
        departureTime: "10:00", 
        duration: "4h 5m", 
        arrivalTime: "14:05", 
        from: "Cardiff", 
        to: "Swansea", 
        price: "£17.30", 
        walking: "9 mins", 
        departureDistance: 9,
        arrivalDistance: 9,
        pickUpTimeWindow: "06:01 - 12:00",
        profileImage: "https://randomuser.me/api/portraits/women/61.jpg", 
        profileName: "Isabella",
        instantBooking: true
    },
    { 
        id: 9, 
        departureTime: "18:15", 
        duration: "3h 25m", 
        arrivalTime: "21:40", 
        from: "Brighton", 
        to: "Southampton", 
        price: "£19.60", 
        walking: "6 mins",
        departureDistance: 6,
        arrivalDistance: 6,
        pickUpTimeWindow: "18:01 - 23:59",
        profileImage: "https://randomuser.me/api/portraits/men/7.jpg", 
        profileName: "Ethan",
        instantBooking: false
    },
    { 
        id: 10, 
        departureTime: "16:30", 
        duration: "2h 45m", 
        arrivalTime: "19:15", 
        from: "Glasgow", 
        to: "Stirling", 
        price: "£14.99", 
        walking: "11 mins", 
        departureDistance: 11,
        arrivalDistance: 11,
        pickUpTimeWindow: "12:01 - 18:00",
        profileImage: "https://randomuser.me/api/portraits/women/27.jpg", 
        profileName: "Charlotte",
        instantBooking: true
    }
]; 

const Rides = () => {
    const location = useLocation();
    const { leavingFrom, goingTo, date, passengers } = location.state;
    const [sortBy, setSoryBy] = useState("");
    const [pickUpFilter, setPickUpFilter] = useState("");

    const pickUpTimeRanges = {
        "before6": ["00:00", "06:00"],
        "6to12": ["06:00", "12:00"],
        "12to18": ["12:01", "18:00"],
        "after18": ["18:01", "23:59"]
    };
    
    const sortRides = (rides) => {
        console.log("Sorting rides with sortBy:", sortBy, "and pickUpFilter:", pickUpFilter); // Add this line
        switch (sortBy) {
            case "price":
                return rides.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
            case "departure":
                return rides.sort((a, b) => {
                    const [hoursA, minutesA] = a.departureTime.split(":").map(Number);
                    const [hoursB, minutesB] = b.departureTime.split(":").map(Number);

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
            case "pickUpTime":

                console.log("pickUpFilter: " + pickUpFilter);
                if (pickUpFilter && pickUpTimeRanges[pickUpFilter]) {
                    const [start, end] = pickUpTimeRanges[pickUpFilter];

                    console.log("Start: " + start + ", End: " + end);
                    return rides.filter((ride) => {
                        const [rideHours, rideMinutes] = ride.departureTime.split(":").map(Number);
                        const rideTime = `${rideHours.toString().padStart(2, '0')}:${rideMinutes.toString().padStart(2, '0')}`;
                        return rideTime >= start && rideTime <= end;
                    });
                }
                return rides;

            default:
                return rides;
        }
    };

    const sortedRides = sortRides([...fakeRides]);
       

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
                            <div className="text-gray-800">{fakeRides.length} rides available with {passengers} passengers</div>
                        </div>
                        
                    </div>
                       


                    <div className="overflow-auto h-[40rem] p-4">
                        {sortedRides.map((ride) => (
                            <div
                                key={ride.id}
                                className="bg-white border rounded-lg p-4 mb-4 shadow-lg flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-200"
                            >   

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">  
                                        <div>
                                            <p className="text-lg font-semibold">{ride.departureTime}</p>
                                        </div>
                                        <AiOutlineArrowRight className="text-xl mx-4" />
                                        <div>
                                            <p className="text-lg font-semibold">{ride.arrivalTime}</p>
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
                                        <p className="text-lg font-semibold">{ride.from}</p>
                                        <p className="text-lg font-semibold">{ride.to}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-1">
                                        <FaWalking className="text-green-500" />
                                        <span>{ride.walking} walking</span>
                                    </div>

                                    <div className="flex items-center">
                                        <MdAttachMoney className="text-xl text-green-500" />
                                        <p className="text-2xl font-bold">{ride.price}</p>
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
                                        <span className="font-semibold">{ride.profileName}</span>
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
