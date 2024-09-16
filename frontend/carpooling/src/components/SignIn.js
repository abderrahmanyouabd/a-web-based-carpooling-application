import React, { useState } from "react";
import MenuBar from "./MenuBar";

const SignIn = () => {
    const [params, setParams] = useState({
        email: '',
        password: ''
    });

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({...params, [name]: value });
    };

    const handleLogin = () => {
        // Authenticate user and redirect to home page
        console.log("User's input values: ", params);
    };
    
    return (
        <div>
            <MenuBar />
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-3xl font-extrabold text-gray-700">What's your email and password?</h1>
                <input 
                    type="text"
                    id="email"
                    name="email"
                    value={params.email}
                    onChange={handleParamChange}
                    placeholder="Email"
                    className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-100 focus:border-indigo-200 sm:text-sm"
                />

                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={params.password}
                    onChange={handleParamChange}
                    placeholder="Password"
                    className="font-bold mt-5 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                /> 

                <button 
                    onClick={handleLogin}
                    className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Login
                </button>
                
            </div>
        </div>
        
    )
}

export default SignIn;