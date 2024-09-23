import React from "react";
import { Link } from "react-router-dom";


const MenuBar = ({ user }) => {
    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-400 p-4 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-white text-3xl px-4 py-2 font-extrabold">
                        CarPooling
                    </Link>
                    <div className="flex space-x-6">
                        {!user ? (
                            <>
                                <Link to="/signin" className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign In</Link>
                                <Link to="/signup" className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign Up</Link>
                            </>
                        ) : (
                            <Link to="/profile" className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">
                                Profile ({user.fullName})
                            </Link>
                        )}
                        
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default MenuBar;