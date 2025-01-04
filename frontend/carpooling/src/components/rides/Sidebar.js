import React, { useState } from "react";
import { FaClock, FaCoins, FaWalking, FaHourglass } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


const Sidebar = ({ setSoryBy, setPickUpFilter}) => {

    const [selectedSort, setSelectedSort] = useState("");
    const [selectedPickUpTime, setSelectedPickUpTime] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showPickUpTimeOptions, setShowPickUpTimeOptions] = useState(false);

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSelectedSort(value);
        setSoryBy(value);
    };

    const handlePickUpTimeChange = (event) => {
        const { value } = event.target;
        setSelectedPickUpTime(value);
        setPickUpFilter(value);
    };

    return (
        <div className="p-4">

            <div>
                <div className="flex justify-center md:justify-start">
                    <h2 className="font-bold text-lg md:mb-4">
                        Sort by
                    </h2>
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
                

                <div className={`md:block ${showSortOptions ? "block" : "hidden"}`}>
                    <div className="flex flex-col bg-white border rounded-lg space-y-2 p-2 mb-6">
                        <label className="flex items-center space-x-2">
                            <input 
                                type="radio"
                                name="sort"
                                value="departure"
                                checked={selectedSort === "departure"}
                                onChange={handleSortChange}
                                className="mr-2"
                            />
                            <span>Earliest </span>
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
                            <span>Close to</span>
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
                            <span>Close to</span>
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
                </div>
                

            </div>
            

            <div>
                <div className="flex justify-center md:justify-start">
                    <h2 
                        className="font-bold text-lg md:mb-4"
                        onClick={() => setShowPickUpTimeOptions((prev) => !prev)}
                    >
                        Pick-up time
                    </h2>
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
                

                <div className={`md:block ${showPickUpTimeOptions ? "block" : "hidden"}`}>

                    <div className="flex flex-col bg-white border rounded-lg space-y-4 p-2">
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
                
            </div>
            
        </div>
    );
};

export default Sidebar;