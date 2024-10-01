import React, { useState } from "react";
import { FaClock, FaCoins, FaWalking, FaHourglass } from "react-icons/fa";


const Sidebar = ({ setSoryBy, setPickUpFilter}) => {

    const [selectedSort, setSelectedSort] = useState("");
    const [selectedPickUpTime, setSelectedPickUpTime] = useState("");

    const handleSortChange = (event) => {
        const { value } = event.target;
        console.log("Selected Sort By: " + value)
        setSelectedSort(value);
        setSoryBy(value);
    };

    const handlePickUpTimeChange = (event) => {
        const { value } = event.target;
        console.log("Selected Sort By: " + value)
        setSoryBy(value);
        setSelectedPickUpTime(value);
        setPickUpFilter(value);
    };

    return (
        <div className="w-1/4 p-6">
            <h2 className="font-bold text-lg mb-4">Sort by</h2>

            <div className="flex flex-col space-y-2 p-2 mb-6">
                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="sort"
                        value="departure"
                        checked={selectedSort === "departure"}
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    <span>Earliest departure</span>
                    <FaClock/>
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="sort"
                        value="price"
                        checked={selectedSort === "price"}
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    <span>Lowest price</span>
                    <FaCoins />
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="sort"
                        value="departurePoint"
                        checked={selectedSort === "departurePoint"}
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    <span>Close to departure point</span>
                    <FaWalking />
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="sort"
                        value="arrivalPoint"
                        checked={selectedSort === "arrivalPoint"}
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    <span>Close to arrival point</span>
                    <FaWalking />
                </label>


                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="sort"
                        value="duration"
                        checked={selectedSort === "duration"}
                        onChange={handleSortChange}
                        className="mr-2"   
                    />
                    <span>Shortest ride</span>
                    <FaHourglass />
                </label>
            </div>

            <h2 className="font-bold text-lg mb-4">Pick-up time</h2>
            <div className="flex flex-col space-y-4 p-2">
                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="pickUpTime"
                        value="before6"
                        className="mr-2"
                        checked={selectedPickUpTime === "before6"}
                        onChange={handlePickUpTimeChange}
                    />
                    <span>Before 06:00</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="pickUpTime"
                        value="6to12"
                        className="mr-2"
                        checked={selectedPickUpTime === "6to12"}
                        onChange={handlePickUpTimeChange}
                    />
                    <span>06:00 - 12:00</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="pickUpTime"
                        value="12to18"
                        className="mr-2"
                        checked={selectedPickUpTime === "12to18"}
                        onChange={handlePickUpTimeChange}
                    />
                    <span>12:01 - 18:00</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input 
                        type="radio"
                        name="pickUpTime"
                        value="after18"
                        className="mr-2"
                        checked={selectedPickUpTime === "after18"}
                        onChange={handlePickUpTimeChange}
                    />
                    <span>After 18:00</span>
                </label>

            </div>
        </div>
    );
};

export default Sidebar;