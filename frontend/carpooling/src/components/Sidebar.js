import React from "react";

const Sidebar = ({ setSoryBy }) => {

    const handleSortChange = (event) => {
        setSoryBy(event.target.value);
    };

    return (
        <div className="w-1/4 p-6">
            <h2 className="font-bold text-lg mb-4">Sort by</h2>
            <div className="flex flex-col space-y-2 p-2">
                <label>
                    <input 
                        type="radio"
                        name="sort"
                        value="departure"
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    Earliest departure
                </label>
                <label>
                    <input 
                        type="radio"
                        name="sort"
                        value="price"
                        onChange={handleSortChange}
                        className="mr-2"
                    />
                    Lowest price
                </label>
                <label>
                    <input 
                        type="radio"
                        name="sort"
                        value="duration"
                        onChange={handleSortChange}
                        className="mr-2"   
                    />
                    Shortest ride
                </label>
                

            </div>
        </div>
    );
};

export default Sidebar;