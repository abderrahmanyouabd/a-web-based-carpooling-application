import React from "react";
import { TextField, MenuItem } from "@mui/material";

const Step6 = ({vehicle, handleVehicleChange, handlePrevious, handleContinue}) => {
    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">Enter Vehicle Details</h1>

            <div className="flex flex-col space-y-4 mt-5">
                <TextField
                    label="Model"
                    name="model"
                    value={vehicle.model}
                    onChange={handleVehicleChange}
                    variant="outlined"
                />
                <TextField
                    label="Color"
                    name="color"
                    value={vehicle.color}
                    onChange={handleVehicleChange}
                    variant="outlined"
                />
                <TextField
                    label="License Plate Number"
                    name="licensePlateNumber"
                    value={vehicle.licensePlateNumber}
                    onChange={handleVehicleChange}
                    variant="outlined"
                />
                <TextField
                    label="Brand"
                    name="brand"
                    value={vehicle.brand}
                    onChange={handleVehicleChange}
                    variant="outlined"
                />
                <TextField
                    select
                    label="Gas Type"
                    name="gasType"
                    value={vehicle.gasType}
                    onChange={handleVehicleChange}
                    variant="outlined"
                >
                    <MenuItem value="GASOLINE">Gasoline</MenuItem>
                    <MenuItem value="DIESEL">Diesel</MenuItem>
                </TextField>
            </div>                

            <div className="flex space-x-16 mt-5">
                <button
                    onClick={handlePrevious}
                    className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Previous
                </button>
                <button
                    onClick={handleContinue}
                    className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Continue
                </button>
            </div>                                                
        
        </>
                                       
    );
}

export default Step6;