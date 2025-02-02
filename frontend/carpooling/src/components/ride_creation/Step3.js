import React from "react";
import MapRouteDrawing from "../gps_tracking/MapRouteDrawing";

const Step3 = ({ startCoordinates, endCoordinates, handleJourneyInfoUpdate, handleContinue, handlePrevious}) => {
    return (
        <>
            <div className="w-full max-w-3xl">
                <MapRouteDrawing 
                    startCoordinates={startCoordinates} 
                    endCoordinates={endCoordinates} 
                    journeyInfoUpdate={handleJourneyInfoUpdate}
                />
            </div>

            <div className="flex space-x-16 mt-2 md:mt-5">
                <button 
                    onClick={handlePrevious}
                    className="px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Previous
                </button>

                <button 
                    onClick={handleContinue}
                    className="px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Continue
                </button>
            </div>
        </>
    );
}

export default Step3;