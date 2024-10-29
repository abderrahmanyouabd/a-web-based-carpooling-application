import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Profile = ({ setUser }) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditPersonalDetailsClicked, setIsEditPersonalDetailsClicked] = useState(false);
    const [isFullNameClicked, setIsFullNameClicked] = useState(false);
    const [isEmailClicked, setIsEmailClicked] = useState(false);
    const [isDateOfBirthClicked, setIsDateOfBirthClicked] = useState(false);
    const [isPhoneNumberClicked, setIsPhoneNumberClicked] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const fetchProfile = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token){
                setErrorMessage("You are not logged in. Please log in first.");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok){
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to fetch profile data.');
                }

            } catch (error) {
                setErrorMessage('An error occured while fetching the profile data. Please try again later.');
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
    }

    const toggleEditProfilePopup = () => {
        setIsEditPersonalDetailsClicked(!isEditPersonalDetailsClicked);
    }

    const toggleFullNamePopup = () => {
        setIsFullNameClicked(!isFullNameClicked);
    }

    const toggleEmailPopup = () => {
        setIsEmailClicked(!isEmailClicked);
    }

    const toggleDateOfBirthPopup = () => {
        setIsDateOfBirthClicked(!isDateOfBirthClicked);
    }

    const togglePhoneNumberPopup = () => {
        setIsPhoneNumberClicked(!isPhoneNumberClicked);
    }

    const handleSave = async (field, value) => {

        console.log("FullName: ", fullName);
        try {
            const token = localStorage.getItem('jwtToken');

            if (!token){
                setErrorMessage("You are not logged in. Please log in first.");
                return;
            }

            const savingObject = {};

            if (field === 'fullName' && value.trim() !== '') {
                savingObject.fullName = value;
            } else if (field === 'email' && value.trim() !== ''){
                savingObject.email = value;
            } else if (field === 'dateOfBirth' && value.trim() !== ''){
                savingObject.dateOfBirth = value;
            } else if (field === 'mobile' && value.trim() !== ''){
                savingObject.mobile = value;
            }

            if (Object.keys(savingObject).length === 0){
                setErrorMessage("No valid data to update");
                return;
            }

            const response = await fetch('http://localhost:8080/api/users', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(savingObject)
            });

            if (response.ok){
                const updatedUser = await response.json();
                console.log('Updated user: ', updatedUser);
                setProfileData(updatedUser);
                setUser(updatedUser);
                setIsFullNameClicked(false);
                setIsEmailClicked(false);
                setIsDateOfBirthClicked(false);
                setIsPhoneNumberClicked(false);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to save profile data.');
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (errorMessage) {
        return <div className="text-red-600">{errorMessage}</div>;
    }

    return (
        
        <div className="flex justify-center items-center mt-10">
            {profileData ? (
                <div className="bg-white max-w-5xl w-full p-12 rounded-lg shadow-lg">

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-sm leading-none">Add profile picture</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-700">
                            {profileData.fullName || "Newcomer"}
                        </h1>
                    </div>

                    <div className="border-b-2 mb-4"></div>

                    <div className="mb-4 hover:bg-gray-200 p-4 rounded-lg">
                        <p onClick={toggleEditProfilePopup} className="text-blue-500 cursor-pointer">Edit personal details</p>
                    </div>

                    <div className="border-b-2 mb-4"></div>

                    <div className="mb-8 leading-relaxed">
                        <h2 className="text-xl font-semibold pl-4">Verify your profile</h2>

                        <div className="flex items-center pl-4">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg">Verify ID</p>
                        </div>
                        
                        {profileData.email ? (
                            <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg">Email: {profileData.email}</p>
                        ) : (
                            <div>
                                <div className="flex items-center pl-4">
                                    <AddCircleOutlineIcon className="text-blue-500" />
                                    <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg">Add email address</p>
                                </div>
                            </div>
                        )}
                        
                        {profileData.mobile ? (
                            <p className="text-blue-500 cursor-pointer hover:bg-gray-200 p-4 rounded-lg">Phone Number: {profileData.mobile}</p>
                        ) : (
                            <div>
                                <div className="flex items-center pl-4">
                                    <AddCircleOutlineIcon className="text-blue-500" />
                                    <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg">Add phone number</p>
                                </div>
                            </div>
                        )}

                        
                    </div>

                    <div className="border-b-2 mb-8"></div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700">About you</h2>

                        <div className="flex items-center pl-4">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 cursor-pointer hover:bg-gray-200 p-4 rounded-lg">Add a mini bio</p>
                        </div>
                        
                        <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                            <p className="pl-4">💬 I'm chatty when I feel comfortable</p>
                            <p className="pl-4">🎵 I'll jam depending on the mood</p>
                            <p className="pl-4">🚬 Cigarette breaks outside the car are ok</p>
                            <p className="pl-4">🐾 I'll travel with pets depending on the animal</p>
                        </div>

                        <div className="flex items-center pl-4">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 cursor-pointer hover:bg-gray-200 p-4 rounded-lg">Edit travel preferences</p>
                        </div>
                        
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out"
                    >
                        Log Out
                    </button>

                    {isEditPersonalDetailsClicked && (
                        <div className="bg-white flex justify-center fixed inset-0 z-50">
                            <div className="w-full max-w-lg h-auto p-8 relative">

                                <div className="text-right">
                                    <button 
                                        onClick={toggleEditProfilePopup}
                                        className="text-3xl text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                                        
                                <div className="flex flex-col items-center">
                                        
                                    <h2 className="text-3xl text-gray-700 font-bold mb-20">Personal Details</h2>
                                    <div className="mb-4 w-full">
                                        <p onClick={toggleFullNamePopup} className="mb-10 text-blue-500 hover:bg-gray-200 rounded-lg p-4"><span className="font-bold text-gray-500">Full Name <br/></span>{profileData.fullName}</p>
                                        <p onClick={toggleDateOfBirthPopup} className="mb-10 text-blue-500 hover:bg-gray-200 rounded-lg p-4"><span className="font-bold text-gray-500">Date Of Birth <br/></span>{profileData.dateOfBirth}</p>
                                        <p className="mb-10 text-gray-500 hover:bg-gray-200 rounded-lg p-4 cursor-not-allowed"><span className="font-bold text-gray-500">Email Address <br/></span>{profileData.email}</p>
                                    </div>
                                    <div className="mt-4">
                                        {profileData.mobile ? (
                                            <div>
                                                <p onClick={togglePhoneNumberPopup} className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg"><span className="font-bold text-gray-500">Phone Number: </span>{profileData.mobile}</p>
                                            </div>  
                                        ) : (
                                            <div>
                                                <AddCircleOutlineIcon className="text-blue-500" />
                                                <button onClick={togglePhoneNumberPopup} className="text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200"> Add Phone Number</button>
                                            </div>
                                        )}
                                        
                                        
                                        <div className="border-b-2 w-96 mt-4 mb-4"></div>
                                        
                                        <div className="flex items-center">
                                            <AddCircleOutlineIcon className="text-blue-500" />
                                            <button className="text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200">Add Mini Bio</button>
                                        </div>
                                        
                                        
                                    </div>

                                </div>

                            </div>
                                    
                        </div>
                    )}

                    {isFullNameClicked && (
                        <div className="bg-white flex justify-center fixed inset-0 z-50"
                            
                        >
                            <div className="w-full max-w-lg h-auto p-8 relative">

                                <div className="text-right">
                                    <button 
                                        onClick={toggleFullNamePopup}
                                        className="text-3xl text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your full name?</h1>
                                    
                                    <input 
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                    <button 
                                        onClick={() => handleSave('fullName', fullName)}
                                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isDateOfBirthClicked && (
                        <div className="bg-white flex justify-center fixed inset-0 z-50">
                            <div className="w-full max-w-lg h-auto p-8 relative">

                                <div className="text-right">
                                    <button 
                                        onClick={toggleDateOfBirthPopup}
                                        className="text-3xl text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your date of birth?</h1>
                                    
                                    <input 
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        placeholder="DD/MM/YY"
                                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                    <button 
                                        onClick={() => handleSave('dateOfBirth', dateOfBirth)}
                                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEmailClicked && (
                        <div className="bg-white flex justify-center fixed inset-0 z-50">
                            <div className="w-full max-w-lg h-auto p-8 relative">

                                <div className="text-right">
                                    <button 
                                        onClick={toggleEmailPopup}
                                        className="text-3xl text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your email address?</h1>
                                    
                                    <input 
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email address"
                                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                    <button
                                        onClick={() => handleSave('email', email)} 
                                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPhoneNumberClicked && (
                        <div className="bg-white flex justify-center fixed inset-0 z-50">
                            <div className="w-full max-w-lg h-auto p-8 relative">

                                <div className="text-right">
                                    <button 
                                        onClick={togglePhoneNumberPopup}
                                        className="text-3xl text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your phone number?</h1>
                                    
                                    <input 
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="phone number"
                                        className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                    <button
                                        onClick={() => handleSave('mobile', phoneNumber)}  // 'mobile' to match the backend field
                                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    

                </div>
            ) : (
                <div>Loading profile data...</div>
            )}
        </div>
    );
};

export default Profile;