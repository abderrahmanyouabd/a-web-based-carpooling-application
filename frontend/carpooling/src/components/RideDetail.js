import React from "react";
import { useLocation } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const RideDetail = ( ) => {
    const location = useLocation();

    const ride = location.state?.ride;

    console.log("Ride: " + ride);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">

            <div className="w-full max-w-3xl space-y-4">

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6"> {ride.leavingFrom.departureTime}</h1>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{ride.leavingFrom.name}</h2>
                            <p className="text-gray-500 mt-1">{ride.leavingFrom.departureTime}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{ride.goingTo.name}</h2>
                            <p className="text-gray-500 mt-1">{ride.leavingFrom.departureTime}</p>
                        </div>
                    </div>
                </div>
            
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex items-center">
                    
                    <img alt="Driver" className="w-12 h-12 rounded-full mr-4"/>
                    <div>
                        <h3 className="text-lg font-semibold">{ride.driver.fullName}</h3>
                        <p className="text-sm text-gray-500">Verified Profile</p>
                    </div>
                    <FaCar className="ml-auto text-gray-500 text-2xl" />
                    
                </div>


                <div className="bg-white rounded-lg shadow-lg p-6">
                        
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xl font-semibold mr-2"> ${ride.farePerSeat}</p>
                            <p className="text-xl font-bold">1 passenger</p>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600">
                            Request to Book
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        Your booking won't be confirmed until the driver approves your request
                    </p>

                    <div className="mt-4 text-center">
                        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50">
                            Contact {ride.driver.fullName}
                        </button>
                    </div>
                    
                </div>
                

            </div>

        
        </div>
    )
}

export default RideDetail;