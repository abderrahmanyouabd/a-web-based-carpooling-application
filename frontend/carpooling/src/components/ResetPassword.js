import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();


    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User's Input: " + password);

        if (password.length <= 10){
            setErrorMessage('Password must be at least 10 characters long.');
            return;
        }

        navigate("/signin")

        // Send a PUT request to the server with the new password
    }

    return (
        <div>
            <div className="flex flex-col items-center mt-10">
                <h1 className="font-extrabold text-3xl text-gray-700 mb-10">Chose a new Password</h1>

                <p className="text-gray-500 mb-4">It must have at least 8 characters, 1 letter, 1 number and 1 special character.</p>

                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    className="font-bold py-2 px-5 h-12 w-[32rem] bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />

                {errorMessage && (
                    <div className="mt-2 text-red-500">{errorMessage}</div>
                )}

                <button 
                    onClick={handleSubmit}
                    className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
            
        </div>
    )
}

export default ResetPassword;