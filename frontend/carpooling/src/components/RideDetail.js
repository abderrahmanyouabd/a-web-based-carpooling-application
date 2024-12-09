import React, { useEffect, useState, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCar, FaCheckCircle, FaBan, FaUserFriends, FaClock, FaShieldAlt } from "react-icons/fa";
import { IconButton, Button, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const RideDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const ride = location.state?.ride;
    const isDriver = profileData?.id === ride.driver.id;
    const token = localStorage.getItem("jwtToken");
    
    useEffect(() => {
        const fetchProfileData = async () => {
            try {

                const response = await fetch(`http://localhost:8080/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    console.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    const fetchClientSecret = async () => {
        try {
            if (!token) {
                console.log("No token found, ask user to sign in");
                showSnackbar("Please sign in to proceed with payment");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/trips/${ride.id}/pay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rideId: ride.id,
                }),
            });

            if (response.ok) {
                const clientSecret = await response.text();
                setClientSecret(clientSecret);

                navigate("/payment", {state: { clientSecret, rideId: ride.id, token } });
            } else if (response.status === 409) {
                showSnackbar("You already joined this trip.");
                console.log("Client already joined this trip.");
            } else {
                console.error("Failed to fetch client secret");
            }

        } catch (error) {
            console.error("Error fetching client secret:", error);
        } finally {
            setPaymentInitiated(false);
        }
    };

    const handlePaymentClick = async () => {
        if (paymentInitiated) return;
        setPaymentInitiated(true);
        await fetchClientSecret();
    };

    const showSnackbar = (message) => {
        setSnackbar({ open: true, message });
    }

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: ""});
    }

    const action = snackbar.message === "You already joined this trip." ? ( 
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>    
    ) : (
        <Fragment>
            <Button color="secondary" size="small" onClick={() => navigate("/signin")}>
                Sign in
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );
        
    
    const handleViewDriverLocation = () => {
        if (!token) {
            console.log("No token found, ask user to sign in");
            showSnackbar("Please sign in to view driver's location");
            return;
        } else {
            navigate(`/view-driver-location/${ride.id}`);
        }
    }

    const formattedDate = (date) => date.replace("T", " "); 

    const formatDateToDayOfTheWeek = (dateWithTSeparator) => {
        const dateWithoutTSeparator = formattedDate(dateWithTSeparator);
        const date = new Date(dateWithoutTSeparator);

        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return formatter.format(date);
    };

    const getTimePart = (datetime) =>{
        if(!datetime) return "";
        const timePart = datetime.split("T")[1];
        return timePart;
    }

    return (
        <div className="p-6 bg-gray-100 flex min-h-screen justify-center space-x-16">

            <div className="w-full max-w-3xl space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6"> {formatDateToDayOfTheWeek(ride.leavingFrom.departureTime)}</h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-lg font-bold">{ride.leavingFrom.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p> */}
                            <p className="text-gray-500 mt-1">10:00</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{ride.goingTo.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p> */}
                            <p className="text-gray-500 mt-1">12:00</p>
                        </div>
                    </div>
                </div>
            
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex flex-col items-start">
                    
                    <div className="flex items-center mb-4">
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                            {ride.driver?.profilePicture ? ( 
                                <img 
                                    src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                    alt="Profile Picture" 
                                    className="w-full h-full object-cover rounded-full" 
                                />
                            ) : (
                                <img 
                                    src={
                                        ride.driver.gender === "FEMALE"
                                            ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                            : ride.driver.gender === "MALE"
                                                ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                    }
                                    alt="Default Profile Picture"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold pl-2">{ride.driver.fullName}</h3>
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
                        <p className="text-lg text-gray-500">{ride.driver.vehicle.model} - {ride.driver.vehicle.color} - {ride.driver.vehicle.licensePlateNumber}</p>
                    </div>
                    

                    <div className="mt-4 text-center space-x-4">
                        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50">
                            Contact {ride.driver.fullName}
                        </button>
                        {isDriver ? (
                            <button
                                onClick={() => navigate(`/track-driver-location/${ride.id}`)}
                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50"
                            >
                                Share My Driver Location
                            </button>
                        ): (
                            <button
                                onClick={handleViewDriverLocation}
                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50"
                            >
                                View Driver Location
                            </button>
                        )}

                    </div>
                    
                </div>
                
                {ride.passengers.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold">Passengers</h1>
                        <div className="mt-2 space-y-4">

                            {ride.passengers.map((passenger, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                        {passenger.profilePicture ? ( 
                                            <img 
                                                src={`data:image/jpeg;base64,${passenger.profilePicture}`} 
                                                alt="Profile Picture" 
                                                className="w-full h-full object-cover rounded-full" 
                                            />
                                        ) : (
                                            <img 
                                                src={
                                                    passenger.gender === "FEMALE"
                                                        ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                                        : passenger.gender === "MALE"
                                                            ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                            : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                                }
                                                alt="Default Profile Picture"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <h2 className="text-sm font-bold ml-2">{passenger.fullName}</h2>
                                        <p className="text-gray-500 ml-2">{passenger.gender}</p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                )}
                
            
            </div>

            <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mt-14">
                    <h1 className="text-lg font-semibold text-gray-800 mb-6"> {formatDateToDayOfTheWeek(ride.leavingFrom.departureTime)}</h1>
                    
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-sm font-bold">{ride.leavingFrom.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p> */}
                            <p className="text-gray-500 mt-1">10:00</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">{ride.goingTo.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p> */}
                            <p className="text-gray-500 mt-1">12:00</p>
                        </div>
                    </div>    

                    <div className="border-b-2 m-5"></div>
                    
                    <div className="mb-4 flex items-center">
                        
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            {ride.driver?.profilePicture ? ( 
                                <img 
                                    src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                    alt="Profile Picture" 
                                    className="w-full h-full object-cover rounded-full" 
                                />
                            ) : (
                                <img 
                                    src={
                                        ride.driver.gender === "FEMALE"
                                            ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                            : ride.driver.gender === "MALE"
                                                ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                    }
                                    alt="Default Profile Picture"
                                    className="w-full h-full object-cover rounded-full"
                                />

                            )}
                        </div>
                        
                        <div className="flex items-center pl-2">
                            <h3 className="text-sm font-semibold">{ride.driver.fullName}</h3>
                            <FaCar className="ml-2 text-gray-500 text-2xl" />
                        </div>
                        
                    </div>
                        
                </div>

                <div className="bg-white rounded-lg shadow-lg p-5 mt-8">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold mr-2"> ${ride.farePerSeat}</p>
                        <p className="text-xl font-bold">1 seat</p>
                    </div>
                </div>

                <button onClick={handlePaymentClick} className="bg-blue-500 text-white px-24 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-600">
                    Proceed to payment
                </button>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbar.message}
                    action={action}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    ContentProps={{
                        sx: {
                            fontSize: '0.8rem'
                        },
                    }}
                />

                
            </div>

        
        </div>
    )
}

export default RideDetail;