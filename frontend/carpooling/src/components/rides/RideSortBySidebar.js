import React, { useState } from "react";
import { FaClock, FaCoins, FaHourglass, FaUsers, FaRoute } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


const RideSortBySidebar = ({ filters, setFilters }) => {

    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showPickUpTimeOptions, setShowPickUpTimeOptions] = useState(false);

    const handleSortByChange = (event) => {
        const { value } = event.target;
        const newValue = filters.sortBy === value ? "" : value; // Toggle the value
        setFilters((prevFilters) => ({
            ...prevFilters, // Keep the existing pickUpTime value
            sortBy: newValue,
        }))
    };

    const handlePickUpTimeChange = (event) => {
        const { value } = event.target;
        const newValue = filters.pickUpTime === value ? "" : value; // ToggleChange
        setFilters((prevFilters) => ({
            ...prevFilters, // Keep the existing sortBy value
            pickUpTime: newValue,
        }))
    };

    const sortByOptions = [
        { value: "departure", label: "Earliest", icon: <FaClock /> },
        { value: "price", label: "Lowest Price", icon: <FaCoins /> },
        { value: "distance", label: "Shortest Distance", icon: <FaRoute /> },
        { value: "availableSeats", label: "Available Seats", icon: <FaUsers /> },
        { value: "duration", label: "Shortest Ride", icon: <FaHourglass /> },
    ];

    const pickUpTimeOptions = [
        { value: "before6", label: "Before 06:00" },
        { value: "6to12", label: "06:00 - 12:00" },
        { value: "12to18", label: "12:01 - 18:00" },
        { value: "after18", label: "After 18:00" },
    ];

    return (
        <div className="p-4">
            
            {/* Sort By Section */}
            <div className="mb-6 border-b-2 pb-4 border-black">
                <div className="flex justify-center md:justify-start">
                    <h2 className="font-bold text-2xl">Sort by</h2>
                    <button
                        className="md:hidden flex items-center pl-2 focus:outline-none"
                        onClick={() => setShowSortOptions((prev) => !prev)}
                    >
                        {showSortOptions ? (
                            <MdKeyboardArrowUp className="text-2xl" />
                        ) : (
                            <MdKeyboardArrowDown className="text-2xl" />
                        )}
                    </button>
                </div>
                
                {/* Sort By Options */}
                <div className={`mt-3 space-y-3 transition-all duration-300 ${showSortOptions ? "block" : "hidden md:block"}`}>
                    {sortByOptions.map(({ value, label, icon}) => (
                        <label
                            key={value}
                            className="flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-yellow-100"
                        >
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    name="sort"
                                    value={value}
                                    checked={filters.sortBy === value}
                                    onChange={handleSortByChange}
                                    className="hidden"
                                />
                                 <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        filters.sortBy === value ? "border-blue-500 bg-blue-500" : "border-gray-400"
                                    }`}
                                >
                                    {filters.sortBy === value && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-lg font-medium">{label}</span>
                            </div>

                            <span className="ml-2">{icon}</span>

                        </label>
                    ))}
                </div>
            
            </div>
            

            {/* Pick-up Time */}
            <div>
                <div className="flex justify-center md:justify-start">
                    <h2 className="font-bold text-2xl">Pick-up time</h2>
                    <button
                        className="md:hidden flex items-center focus:outline-none"
                        onClick={() => setShowPickUpTimeOptions((prev) => !prev)}
                    >
                        {showPickUpTimeOptions ? (
                            <MdKeyboardArrowUp className="text-2xl" />
                        ) : (
                            <MdKeyboardArrowDown className="text-2xl" />
                        )}
                    </button>
                </div>
                
                {/* Pick up by options */}
                <div className={`mt-3 space-y-3 transition-all duration-300 ${showPickUpTimeOptions ? "block" : "hidden md:block"}`}>
                    {pickUpTimeOptions.map(({value, label}) => (
                        <label
                            key={value}
                            className="flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-yellow-100"
                        >
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="pickUpTime"
                                    value={value}
                                    checked={filters.pickUpTime === value}
                                    onChange={handlePickUpTimeChange}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        filters.pickUpTime === value ? "border-blue-500 bg-blue-500" : "border-gray-400"
                                    }`}
                                >
                                    {filters.pickUpTime === value && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-lg font-medium">{label}</span>
                            </div>
                        </label>
                    ))}
                    
                </div>
            </div>
            
        </div>
    );
};

export default RideSortBySidebar;