import React from "react";
import { useNavigate } from "react-router-dom";

const Step0 = () => {

    const navigate = useNavigate();

    return (
        <>
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-16">How do you want to log in?</h1>
            <div className="w-full max-w-xs">
                <button
                    onClick={() => navigate("/signin")}
                    className="flex items-center justify-between w-full px-4 py-3 mb-8 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                    <span>Continue with email</span>
                    <span>&gt;</span>
                </button>
                <button
                    className="flex items-center justify-between w-full px-4 py-3 mb-8 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                    <span>Continue with Facebook</span>
                    <span className="text-blue-600">&gt;</span>
                </button>
                <div className="text-center text-gray-500 mt-4">
                    Not a member yet?{" "}
                    <button 
                        onClick={() => navigate("/signup")}
                        className="text-blue-500 hover:underline"
                    >
                        Sign Up
                    </button>
                </div>
            </div>

        </>
    )
}

export default Step0;