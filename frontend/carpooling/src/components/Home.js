import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import TripSearch from "./TripSearch";
import CarPoolCommercial from "../CarPoolingPictures/carpool_commercial2.png"
import BigCarSharing from "../CarPoolingPictures/big_carsharing.png";

const Home = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        if (location.state?.snackbarMessage) {
            setSnackbarMessage(location.state.snackbarMessage);
            setShowSnackbar(true);
        }
    }, [location.state]);

    return (
        <div>

            {/* Snackbar Notification */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={4000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setShowSnackbar(false)}
                    severity="success"
                    sx={{ width: '100%'}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Hero Section */}
            <div className="relative text-center">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <img 
                    src={CarPoolCommercial}
                    alt="Commerical Car"
                    className="w-full h-72 object-cover"
                />
                <h1 className="absolute inset-0 flex flex-col justify-center items-center text-2xl md:text-4xl font-bold text-white px-4">
                    Carpool to thousands of destinations at low prices
                </h1>
               
            </div>
            
            {/* Trip Search */}
            <div className="relative inset-0 justify-center items-center bg-gray-100">
                <TripSearch />
            </div>

            {/* Features Section */}
            <div className="bg-gray-100 py-12">
                <div className="container mx-auto flex flex-wrap justify-around space-y-6 md:space-y-0">
                    {[
                        { icon: "🚗", title: "Your pick of rides at low prices", text: "Wherever you’re going, there’s a carpool that will get you there for less." },
                        { icon: "👥", title: "Trustworthy and simple", text: "We check reviews, profiles, and IDs, so you know who you’re travelling with. Our app is both simple and secure thanks to powerful technology." },
                        { icon: "⚡", title: "Proximity makes it easier", text: "There is always a ride close to you. Now you can find the closest ride among the largest carpool network ever with a simple filter." }
                    ].map((item, index) => (
                        <div key={index} 
                            className="text-center w-80 p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-blue-500 hover:text-white  hover:shadow-2xl"
                        >
                            <i className="text-5xl mb-4">{item.icon}</i>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="relative bg-white py-12">

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div> {/* Subtle background pattern */}

                <div className="container relative mx-auto flex flex-col md:flex-row items-center justify-around">
                    <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                        <img
                            src={BigCarSharing}
                            alt="CarPool Illustration"
                            className="max-w-xs"
                        />
                    </div>

                    <div className="w-full md:w-1/2 text-center md:text-left px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Where do you want to drive to?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Sharing a carpool is a great way to travel. It's affordable, comfortable and eco-friendly! 
                            If you're driving with an empty car, consider publishing a carpool ride on BlaBlaCar to 
                            save costs and travel with some company. Our community of carpoolers is the most trustworthy 
                            in the world.
                        </p>
                        <button onClick={() => navigate("/create-ride")} className="bg-blue-500 text-white text-lg px-10 py-4 rounded-full hover:bg-blue-700 hover:shadow-lg transition duration-300">
                            Offer your ride
                        </button>

                    </div>

                </div>

            </div>

           
        </div>
    )
}

export default Home;