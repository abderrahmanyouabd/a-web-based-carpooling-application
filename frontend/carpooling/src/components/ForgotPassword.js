import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User's Input: " + email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        navigate("/signin")

        // Send a POST request to the server with the email to send a password reset link
    }

    return (
        <div> 
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-3xl font-extrabold text-gray-700">What’s the email associated with your account?</h1>
                <h1 className="text-3xl font-extrabold text-gray-700">We’ll email you a link to reset your password.</h1>

                <input 
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                    className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-100 focus:border-indigo-200 sm:text-sm"
                />

                {errorMessage && (
                    <p className="text-red-600 mt-2">{errorMessage}</p>
                )}

                <button 
                    onClick={handleSubmit}
                    className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Send a reset link
                </button>
            </div>
            
        </div>
    )
}

export default ForgotPassword;