import React from "react";
import { useLocation } from "react-router-dom";
import { FaCar, FaCheckCircle, FaBan, FaUserFriends, FaClock, FaShieldAlt } from "react-icons/fa";

const RideDetail = ( ) => {
    const location = useLocation();

    const ride = location.state?.ride;

    console.log("Ride: " + ride);

    const formattedDate = ( date ) =>{
        return date.replace("T", " ");
    }

    return (
        <div className="p-6 bg-gray-100 flex min-h-screen justify-center space-x-16">

            <div className="w-full max-w-3xl space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6"> {formattedDate(ride.leavingFrom.departureTime)}</h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-lg font-bold">{ride.leavingFrom.name}</h2>
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{ride.goingTo.name}</h2>
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                    </div>
                </div>
            
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex flex-col items-start">
                    
                    <div className="flex items-center mb-4">
                        <img alt="Driver" className="w-12 h-12 rounded-full mr-4"/>
                        <h3 className="text-lg font-semibold">{ride.driver.fullName}</h3>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <FaCheckCircle className="text-blue-500 mr-2" />
                        <p className="text-lg text-gray-500">Verified Profile</p>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <FaShieldAlt className="text-gray-500 mr-2" />
                        <p className="text-lg text-gray-500">Rarely cancels rides</p>
                    </div>
                    
                    
                    <div className="border-b-2 w-full mb-4"></div>
                    
                    <div className="flex items-center mb-4">
                        <FaClock className="text-gray-500 mr-2"/>
                        <div className="text-lg text-gray-500">Your booking will be confirmed instantly</div>
                    </div>

                    <div className="flex items-center mb-4">
                        <FaUserFriends className="text-gray-500 mr-2" />
                        <span className="text-lg text-gray-500">Max. 2 in the back</span>
                    </div>

                    <div className="flex items-center mb-4">
                        <FaBan className="text-gray-500 mr-2" />
                        <span className="text-lg text-gray-500">No smoking, please</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <FaCar className="text-gray-500 text-2xl mr-2"/>
                        <p className="text-lg text-gray-500">Lamborghini - White</p>
                    </div>
                    

                    <div className="mt-4 text-center">
                        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50">
                            Contact {ride.driver.fullName}
                        </button>
                    </div>
                    
                </div>
            
            </div>

            <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mt-14">
                    <h1 className="text-lg font-semibold text-gray-800 mb-6"> {formattedDate(ride.leavingFrom.departureTime)}</h1>
                    
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-sm font-bold">{ride.leavingFrom.name}</h2>
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">{ride.goingTo.name}</h2>
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                    </div>    

                    <div className="border-b-2 m-5"></div>
                    
                    <div className="mb-4 flex flex-col items-start">

                        <div className="mb-2">
                            <img alt="Driver" className="w-12 h-12 rounded-full mr-4" />
                        </div>
                        
                        <div className="flex items-center">
                            <h3 className="text-sm font-semibold">{ride.driver.fullName}</h3>
                            <FaCar className="ml-2 text-gray-500 text-2xl" />
                        </div>
                        
                    </div>
                        
                </div>

                <div className="bg-white rounded-lg shadow-lg p-5 mt-8">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold mr-2"> ${ride.farePerSeat}</p>
                        <p className="text-xl font-bold">1 passenger</p>
                    </div>
                </div>

                <button className="bg-blue-500 text-white px-24 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-600">
                    Request to Book
                </button>
            </div>

        
        </div>
    )
}

export default RideDetail;