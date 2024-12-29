import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const MenuBar = ({ setUser, user }) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    const token = localStorage.getItem('jwtToken')
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const toggleDesktopMenu = () => {
        setIsDesktopMenuOpen(!isDesktopMenuOpen);
    }

    const handleLogout = () => {
        setIsDesktopMenuOpen(!isDesktopMenuOpen);
        localStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
    }

    useEffect(() => {
        const fetchProfileData = async () => {
            if (token){
                const profileResponse = await fetch('http://localhost:8080/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setUser(profileData);
                } else {
                    console.log("Failed to fetch profile data for MenuBar");
                }
            }
        }
        fetchProfileData();

    }, [token]);

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-400 p-4 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-white md:text-3xl text-xl  px-4 py-2 font-extrabold">
                        CarPooling
                    </Link>

                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="text-white focus:outline-none px-4 py-2 relative z-50">
                            <div className="w-8 h-8 relative py-2">
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                                ></span>
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'translate-y-2'}`}
                                ></span>
                                <span
                                    className={`block absolute w-full h-1 bg-white transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-4'}`}
                                ></span>
                            </div>
                        </button>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        {token && user ? (
                            <>  
                                <button 
                                    onClick={toggleDesktopMenu} 
                                    className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out"
                                >   
                                    <div className="flex items-center">
                                        {user.fullName}
                                        <svg 
                                            className={`w-5 h-5 ml-2 transition-transform transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`} 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M10 3a1 1 0 00-.71.29l-5 5a1 1 0 001.42 1.42L10 5.41l4.29 4.3a1 1 0 001.42-1.42l-5-5A1 1 0 0010 3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/signin" className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign In</Link>
                                <Link to="/signup" className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign Up</Link>
                            </>
                        )}
                        
                    </div>

                    {isDesktopMenuOpen && (
                        <div className="absolute top-16 right-32 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                            <ul className="py-2">
                                <li>
                                    <Link
                                        to="/profile"
                                        onClick={toggleDesktopMenu}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/your-rides"
                                        onClick={toggleDesktopMenu}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded"
                                    >
                                        Your Rides
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register-vehicle"
                                        onClick={toggleDesktopMenu}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded"
                                    >
                                        Register Vehicle
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed top-16 w-64 right-0 p-4 z-50">
                            <div className="flex flex-col space-y-4 bg-blue-500 rounded-lg">
                                {!user ? (
                                    <>
                                        <Link to="/signin" onClick={toggleMobileMenu} className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign In</Link>
                                        <Link to="/signup" onClick={toggleMobileMenu} className="text-white px-4 py-2 rounded-md text-lg font-bold hover:bg-blue-700 hover:shadow-md transition-all duration-200 ease-in-out">Sign Up</Link>
                                    </>
                                ) : ( 
                                    <>
                                        <ul>
                                            <li>
                                                <Link 
                                                    to="/profile" 
                                                    onClick={toggleMobileMenu}
                                                    className="block text-white px-4 py-2 rounded"
                                                >
                                                    Profile ({user.fullName})
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    to="your-rides"
                                                    onClick={toggleMobileMenu}
                                                    className="block text-white px-4 py-2 rounded"
                                                >
                                                    Your Rides
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    to="/register-vehicle"
                                                    onClick={toggleMobileMenu}
                                                    className="block text-white px-4 py-2 rounded"
                                                >
                                                    Register Vehicle
                                                </Link>
                                            </li>

                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-white text-left px-4 py-2 rounded"
                                                >
                                                    Log Out
                                                </button>
                                            </li>

                                        </ul>
                                    
                                    </>
                                    
                                        
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