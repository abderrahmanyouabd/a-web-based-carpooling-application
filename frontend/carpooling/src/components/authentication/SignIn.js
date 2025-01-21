import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const SignIn = ({ setUser }) => {
    const [params, setParams] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BACKEND_API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("User's input values: ", params);
                console.log("JWT Token: ", data.jwt);
        
                localStorage.setItem('jwtToken', data.jwt);
    
                const token = data.jwt;
                const profileResponse = await fetch(`${BACKEND_API_BASE_URL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setUser(profileData);
                    navigate('/'); 
                } else {
                    setErrorMessage("Failed to fetch profile data after login.");
                }
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage("An error occurred while logging in. Please check your credentials.");
        }
    };    
    
    return (
        <div>
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your email and password?</h1>
                <input 
                    type="text"
                    id="email"
                    name="email"
                    value={params.email}
                    onChange={handleParamChange}
                    placeholder="Email"
                    className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-100 focus:border-indigo-200 sm:text-sm"
                />

                <div className="flex flex-col w-[20rem] md:w-[32rem] mt-5">
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={params.password}
                        onChange={handleParamChange}
                        placeholder="Password"
                        className="font-bold py-2 px-5 h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <div className="flex justify-end mt-2">
                        <Link to="/signin/forgot-password" className="text-blue-500 underline">Forgot Password</Link>
                    </div>
                </div>

                <button 
                    onClick={handleLogin}
                    className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Login
                </button>

                {errorMessage && (
                    <div className="text-red-600 mt-5">
                        {errorMessage}
                    </div>
                )}
                
            </div>

            
        </div>
        
    )
}

export default SignIn;