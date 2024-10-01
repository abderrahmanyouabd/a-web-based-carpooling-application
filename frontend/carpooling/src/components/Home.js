import React from "react";
import TripSearch from "./TripSearch";
import CarPoolCommercial from "../CarPoolingPictures/carpool_commercial2.png"
import BigCarSharing from "../CarPoolingPictures/big_carsharing.png";

const Home = () => {

    return (
        <div className="font-sans">

            <div className="relative text-center">
                <img 
                    src={CarPoolCommercial}
                    alt="Commerical Car"
                    className="w-full h-72 object-cover brightness-75"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold text-white">
                        Carpool to thousands of destinations at low prices
                    </h1>
                    <TripSearch />
                </div>
            </div>

            <div className="bg-gray-100 py-12">
                <div className="container mx-auto flex flex-wrap justify-around space-y-6 md:space-y-0">
                    <div className="text-center w-80 p-4 bg-white shadow-lg rounded-lg">
                        <i className="text-4xl mb-4">🚗</i>
                        <h3 className="text-xl font-semibold mb-2">
                            Your pick of rides at low prices
                        </h3>
                        <p>
                            Wherever you’re going, there’s a carpool that will get you there for less.
                        </p>
                    </div>
                    <div className="text-center w-80 p-4 bg-white shadow-lg rounded-lg">
                    <i className="text-4xl mb-4">👥</i>
                        <h3 className="text-xl font-semibold mb-2">
                            Trustworthy and simple
                        </h3>
                        <p>
                            We check reviews, profiles and IDs, so you know who you’re travelling with; and our app is both simple and secure thanks to powerful technology.
                        </p>
                    </div>
                    <div className="text-center w-80 p-4 bg-white shadow-lg rounded-lg">
                        <i className="text-4xl mb-4">⚡</i>
                        <h3 className="text-xl font-semibold mb-2">
                            Proximity makes it easier
                        </h3>
                        <p>
                            There is always a ride close to you. Now you can find the closest ride among the largest carpool network ever with a simple filter.
                        </p>
                    </div>

                </div>
            </div>

            <div className="bg-white py-12">

                <div className="container mx-auto flex flex-col md:flex-row items-center justify-around">
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
                        <button className="bg-blue-500 text-white text-lg px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300">
                            Offer your ride
                        </button>

                    </div>

                </div>

            </div>

            <footer className="bg-gray-100 py-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            Terms and Conditions
                        </a>
                        <span className="mx-2 text-gray-600">|</span>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            Privacy Policy
                        </a>
                    </div>

                    <p className="text-gray-600">
                        &copy; 2024 CarPooling. All rights reserved.
                    </p>
                </div>
            </footer>

           
        </div>
    )
}

export default Home;