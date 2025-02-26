import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white p-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                {/* Company Message */}
                <p className="text-gray-400 text-sm md:text-base w-full md:w-1/2">
                    At CarPooling, we are committed to providing safe, affordable, and eco-friendly travel solutions. 
                    Join our trusted community and make every ride a better experience.
                </p>
                
                {/* Navigation Links */}
                <div className="flex space-x-6 w-full md:w-auto">
                    <a href="/" className="text-gray-400 hover:text-gray-200">Terms and Conditions</a>
                    <span className="text-gray-500">|</span>
                    <a href="/" className="text-gray-400 hover:text-gray-200">Privacy Policy</a>
                    <span className="text-gray-500">|</span>
                    <a href="/" className="text-gray-400 hover:text-gray-200">Contact Us</a>
                </div>
            </div>
            
            {/* Copyright Text */}
            <div className="container mx-auto text-center mt-4">
                <p className="text-gray-400 text-sm md:text-base">&copy; 2024 CarPooling. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;