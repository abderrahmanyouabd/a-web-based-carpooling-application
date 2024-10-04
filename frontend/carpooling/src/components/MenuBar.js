import React, { useState } from "react";
import { Link } from "react-router-dom";


const MenuBar = ({ user }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log("IsMenuOpen: " + isMenuOpen);
    }

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-400 p-4 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-white md:text-3xl text-lg  px-4 py-2 font-extrabold">
                        CarPooling
                    </Link>

                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none px-4 py-2 relative z-50">
                            <div className="w-8 h-8 relative py-2">
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                                ></span>
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'translate-y-2'}`}
                                ></span>
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-4'}`}
                                ></span>
                            </div>
                        </button>
                    </div>

                    <div className="hidden md:flex space-x-6">
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

                    {isMenuOpen && (
                        <div className="md:hidden fixed top-16 w-64 right-0 p-4 z-50">
                            <div className="flex flex-col space-y-4 bg-blue-500 rounded-lg">
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
                    )}
                </div>
            </div>
        </nav>
    );
}

export default MenuBar;