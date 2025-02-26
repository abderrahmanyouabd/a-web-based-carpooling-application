import React, { useEffect, useState, Fragment } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { FaCar, FaCheckCircle, FaClock, FaShieldAlt,FaInfoCircle } from "react-icons/fa";
import { IconButton, Button, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {jwtDecode} from "jwt-decode";
import RenderStars from "./RenderStars";
import axios from "axios";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const RideDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const ride = location.state?.ride;
    const isDriver = profileData?.id === ride.driver.id;
    const [reviewSummary, setReviewSummary] = useState(null);
    const token = localStorage.getItem("jwtToken");


    const isPassenger = () => {
        if (!token) {
            return false;
        }

        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken?.email;

        console.log("User email: " + userEmail);

        if (!userEmail) {
            return false;
        }

        return ride.passengers.some(
            (passenger) => passenger.email === userEmail
        );
    }

    useEffect(() => {
        const fetchReviewSummary = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_BASE_URL}/api/reviews/users/${ride.driver.id}/summary`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Review summary: ", response.data);
                setReviewSummary(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        if (ride.driver?.id){
            fetchReviewSummary();
        }

    }, [ride.driver?.id, token])


    useEffect(() => {
        const fetchProfileData = async () => {
            try {

                const response = await fetch(`${BACKEND_API_BASE_URL}/api/users/profile`, {
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
    }, [token]);

    const fetchClientSecret = async () => {
        try {
            if (!token) {
                console.log("No token found, ask user to sign in");
                showSnackbar("Please sign in to proceed with payment");
                return;
            }

            const response = await fetch(`${BACKEND_API_BASE_URL}/api/trips/${ride.id}/pay`, {
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

    const handleContactDriver = () => {
        if (!token) {
            console.log("No token found, ask user to sign in");
            showSnackbar("Please sign in to contact driver");
            return;
        } else {
            navigate(`/chat/${ride.id}`, {state: { driverName: ride.driver.fullName } });
        }
    };

    const handleViewReviews = () => {
        if (!token) {
            console.log("No token found, ask user to sign in");
            showSnackbar("Please sign in to view reviews");
            return;
        } else {
            navigate(`/view-reviews/${ride.id}`, {state: { driverInfo: ride.driver } });
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


    return (
        <div className="p-6 pt-2 md:pt-6 bg-gray-100 flex flex-col min-h-screen justify-center md:flex-row md:space-x-16">

            <div className="w-full md:max-w-3xl space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-6"> {formatDateToDayOfTheWeek(ride.leavingFrom.departureTime)}</h1>

                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                    <div className="flex flex-col space-y-4 md:space-y-8">
                        <div>
                            <h2 className="text-lg font-bold">{ride.leavingFrom.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p> */}
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{ride.goingTo.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p> */}
                            <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p>
                        </div>
                    </div>
                </div>
            
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-2 md:mb-4 flex flex-col items-start">
                    
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-full">
                            {ride.driver?.profilePicture ? ( 
                                <img 
                                    src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                    alt="Profile" 
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
                                    alt="Default Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            )}
                        </div>

                        <div className="flex flex-col pl-2">
                            <h3 className="text-md md:text-lg font-semibold pl-2">{ride.driver.fullName}</h3>
                            <button 
                                onClick={handleViewReviews}
                                className="mt-2 px-4 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >   
                                <div className="flex items-center">
                                    {reviewSummary ? RenderStars(reviewSummary.averageRating) : "No Ratings"} 
                                    <span className="pl-2 text-sm">{reviewSummary ? `(${reviewSummary.totalReviews})` : ""}</span>
                                </div>
                                
                            </button>
                        </div>
                        
                    </div>
                    
                    <div className="flex items-center mb-2 md:mb-4">
                        <FaCheckCircle className="text-blue-500 mr-2" />
                        <p className="text-lg text-gray-500">Verified Profile</p>
                    </div>
                    
                    <div className="flex items-center mb-2 md:mb-4">
                        <FaShieldAlt className="text-gray-500 mr-2" />
                        <p className="text-lg text-gray-500">Rarely cancels rides</p>
                    </div>
                    
                    
                    <div className="border-b-2 w-full mb-2 md:mb-4"></div>
                    
                    <div className="flex items-center mb-2 md:mb-4">
                        <FaClock className="text-gray-500 mr-2"/>
                        <div className="text-lg text-gray-500">Your booking will be confirmed instantly</div>

                    </div>

                    {ride.preferences.map((preference, index) => (
                        <div key={index} className="flex items-center text-gray-500 mb-2 md:mb-4">
                            <FaInfoCircle className="text-gray-500 mr-2" />
                            <span className="text-lg text-gray-500">{preference}</span>
                        </div>
                    ))}
                    
                    <div className="flex items-center mb-2 md:mb-4">
                        <FaCar className="text-gray-500 text-2xl mr-2"/>
                        <p className="text-lg text-gray-500">{ride.driver.vehicle.model} - {ride.driver.vehicle.color} - {ride.driver.vehicle.licensePlateNumber}</p>
                    </div>
                    
                    {isPassenger() && (
                        <div className="mt-4 w-full flex flex-col text-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                            <button onClick={handleContactDriver} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50">
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
                    )}
                    
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
                                                alt="Profile" 
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
                                                alt="Default Profile"
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
                <div className="hidden md:block bg-white rounded-lg shadow-lg p-4 md:p-6 mt-4 md:mt-14">
                    <h1 className="text-lg font-semibold text-gray-800 mb-6"> {formatDateToDayOfTheWeek(ride.leavingFrom.departureTime)}</h1>
                    
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h2 className="text-sm font-bold">{ride.leavingFrom.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p> */}
                            <p className="text-gray-500 mt-1">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">{ride.goingTo.name}</h2>
                            {/* <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p> */}
                            <p className="text-gray-500 mt-1">{formattedDate(ride.goingTo.arrivalTime)}</p>
                        </div>
                    </div>    

                    <div className="border-b-2 m-5"></div>
                    
                    <div className="mb-2 md:mb-4 flex items-center">
                        
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            {ride.driver?.profilePicture ? ( 
                                <img 
                                    src={`data:image/jpeg;base64,${ride.driver.profilePicture}`} 
                                    alt="Profile" 
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
                                    alt="Default Profile"
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

                <div className="bg-white rounded-lg shadow-lg p-5 mt-4">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold mr-2"> €{ride.farePerSeat}</p>
                        <p className="text-xl font-bold">1 seat</p>
                    </div>
                </div>

                <button onClick={handlePaymentClick} className="w-full bg-blue-500 text-white px-16 md:px-24 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-600">
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