import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { IconButton, TextField, MenuItem, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const RegisterVehicle = () => {
    const [open, setOpen] = useState(false);
    const [hasVehicle, setHasVehicle] = useState(false);
    const [existingVehicle, setExistingVehicle] = useState(false);
    const [vehicle, setVehicle] = useState({
        model: '',
        color: '',
        licensePlateNumber: '',
        brand: '',
        gasType: ''
    });

    useEffect(() => {
        const checkUserVehicle = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const vehicleResponse = await axios.get('http://localhost:8080/api/vehicle', 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                if (vehicleResponse.data && Object.keys(vehicleResponse.data).length > 0) {
                    setHasVehicle(true);
                    setExistingVehicle(vehicleResponse.data);
                } else {
                    setHasVehicle(false);
                }
                
            } catch (error) {
                console.error("Unable to fetch vehicle data: ", error);
                return false;
            }
        };

        checkUserVehicle();
    }, []);
    

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        setVehicle(prevVehicle => ({ ...prevVehicle, [name]: value }));
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const vehicleResponse = await axios.post('http://localhost:8080/api/vehicle', 
                vehicle,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setOpen(true);
            console.log("Vehicle created successfully: ", vehicleResponse.data);
        } catch (error) {
            console.error("Unable to save the vehicle to the database: ", error);
        }
    }


    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setOpen(false)}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    )

    

    return (
        <div className="flex flex-col items-center mt-10">
            {hasVehicle ? (
                <div className="w-1/2 h-2/3 bg-white shadow-lg rounded-lg">
                    <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg">
                        <h1 className="text-2xl font-bold text-center">You already have a registered vehicle</h1>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex flex-col space-y-2 text-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Model:</span>
                                <span>{existingVehicle.model}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Color:</span>
                                <span>{existingVehicle.color}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">License Plate:</span>
                                <span>{existingVehicle.licensePlateNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Brand:</span>
                                <span>{existingVehicle.brand}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Gas Type:</span>
                                <span>{existingVehicle.gasType}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-100 text-center">
                        <p className="text-gray-600 text-sm">You are only allowed to register one vehicle.</p>
                    </div>
                </div>  
            ) : (
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

                    <button 
                        onClick={handleSubmit}
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                        >
                        Submit
                    </button>
                </>
            )}
            

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Vehicle has been registered successfully"
                action={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                ContentProps={{
                    sx: {
                        fontSize: '1rem'
                    },
                }}
            />

        </div>
    );
}

export default RegisterVehicle;