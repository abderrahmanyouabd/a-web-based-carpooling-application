import React from "react";
import { useLocation } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const RideDetail = ( ) => {
    const location = useLocation();

    const ride = location.state?.ride;

    console.log("Ride: " + ride);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Ride Details</h1>
            
            <div className="bg-white border rounded-lg p-6 mt-6 shadow-lg">
                <p><strong>From:</strong> {ride.leavingFrom.name}</p>
                <p><strong>To:</strong> {ride.goingTo.name}</p>
                <p><strong>Departure Time:</strong> {ride.leavingFrom.departureTime}</p>
                <p><strong>Arrival Time:</strong> {ride.arrivalTime}</p>
                <p><strong>Duration:</strong> {ride.duration}</p>
                <p><strong>Price:</strong> {ride.farePerSeat}</p>
                <p><strong>Walking:</strong> {ride.walking}</p>
                <p><strong>Profile Name:</strong> {ride.driver.fullName}</p>
                <p><strong>Instant Booking:</strong> {ride.instantBooking ? 'Available' : 'Not Available'}</p>

                <div className="flex items-center mt-4">
                    <FaCar className="text-2xl text-gray-500" />
                    <img 
                        src={ride.profileImage} 
                        alt="profile" 
                        className="w-10 h-10 rounded-full border mx-4"
                    />
                    <span className="font-semibold">{ride.profileName}</span>
                </div>

            

            </div>
        </div>
    )
}

export default RideDetail;