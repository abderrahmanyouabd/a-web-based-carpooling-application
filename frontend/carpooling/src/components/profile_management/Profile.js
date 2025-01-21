import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddProfilePicture from "./AddProfilePicture";
import EditPersonalDetails from "./EditPersonalDetails";
import EditFullName from "./EditFullName";
import EditDateOfBirth from "./EditDateOfBirth";
import EditEmailAddress from "./EditEmailAddress";
import EditPhoneNumber from "./EditPhoneNumber";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const Profile = ({ setUser }) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAddProfilePictureClicked,  setIsAddProfilePictureClicked] = useState(false);
    const [isEditPersonalDetailsClicked, setIsEditPersonalDetailsClicked] = useState(false);
    const [isFullNameClicked, setIsFullNameClicked] = useState(false);
    const [isEmailClicked, setIsEmailClicked] = useState(false);
    const [isDateOfBirthClicked, setIsDateOfBirthClicked] = useState(false);
    const [isPhoneNumberClicked, setIsPhoneNumberClicked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchProfile = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token){
                setErrorMessage("You are not logged in. Please log in first.");
                return;
            }

            try {
                const response = await fetch(`${BACKEND_API_BASE_URL}/api/users/profile`, {
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

    const toggleAddProfilePicturePopup = () => {
        setIsAddProfilePictureClicked(!isAddProfilePictureClicked);
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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file); // Append the file directly
            await handleSave('profilePicture', formData); // Call handleSave with the FormData
        }
    };
    

    const handleSave = async (field, value) => {
        console.log("Field: ", field, "Value: ", value);
        try {
            const token = localStorage.getItem('jwtToken');
    
            if (!token) {
                setErrorMessage("You are not logged in. Please log in first.");
                return;
            }
    
            const savingObject = new FormData();
    
    
            if (field === 'fullName' && value.trim() !== '') {
                savingObject.append('fullName', value);
            } else if (field === 'email' && value.trim() !== '') {
                savingObject.append('email', value);
            } else if (field === 'dateOfBirth' && value.trim() !== '') {
                savingObject.append('dateOfBirth', value);
            } else if (field === 'mobile' && value.trim() !== '') {
                savingObject.append('mobile', value);
            } else if (field === 'profilePicture' && value.has('profilePicture')) {
                console.log("Profile Picture");
                savingObject.append('profilePicture', value.get('profilePicture')); 
            }
    
            console.log("Saving Object: ", [...savingObject]); 
    
            if (savingObject.has('fullName') || savingObject.has('email') || savingObject.has('mobile') || savingObject.has('dateOfBirth') || savingObject.has('profilePicture')) {
                const response = await fetch(`${BACKEND_API_BASE_URL}/api/users`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Do not set Content-Type to 'application/json' when sending FormData
                    },
                    body: savingObject
                });
    
                if (response.ok) {
                    const updatedUser = await response.json();
                    console.log('Updated user: ', updatedUser);
                    setProfileData(updatedUser);
                    setUser(updatedUser);
                    setIsFullNameClicked(false);
                    setIsEmailClicked(false);
                    setIsDateOfBirthClicked(false);
                    setIsPhoneNumberClicked(false);
                    setIsAddProfilePictureClicked(false);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to save profile data.');
                }
            } else {
                setErrorMessage("No valid data to update");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while saving the profile data. Please try again later.');
        }
    };    

    if (errorMessage) {
        return <div className="text-red-600">{errorMessage}</div>;
    }

    return (
        
        <div className="flex justify-center items-center mt-10">
            {profileData ? (
                <div className="bg-white max-w-5xl w-full p-12 rounded-lg shadow-lg">

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                            
                            {profileData.profilePicture ? (
                                <img 
                                    src={`data:image/jpeg;base64,${profileData.profilePicture}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover rounded-full" 
                                />
                            ) : (
                                <img 
                                    src={
                                        profileData.gender === "FEMALE"
                                            ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                            : profileData.gender === "MALE"
                                                ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                    }
                                    alt="Default Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />

                            )}

                        </div>
                        <h1 className="text-3xl font-bold text-gray-700">
                            {profileData.fullName || "Newcomer"}
                        </h1>
                    </div>

                    <div className="border-b-2 mb-4"></div>

                    <div className="mb-4">
                        <div onClick={toggleAddProfilePicturePopup} className="flex items-center hover:bg-gray-200 p-4 rounded-lg cursor-pointer">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 pl-4">Add Profile Picture</p>
                        </div>
                        <p onClick={toggleEditProfilePopup} className="text-blue-500 cursor-pointer hover:bg-gray-200 p-4 rounded-lg">Edit personal details</p>
                    </div>

                    <div className="border-b-2 mb-4"></div>

                    <div className="mb-8 leading-relaxed">
                        <h2 className="text-xl font-semibold pl-4">Verify your profile</h2>

                        <div className="flex items-center pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 p-4">Verify ID</p>
                        </div>
                        
                        {profileData.email ? (
                            <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg">Email: {profileData.email}</p>
                        ) : (
                            <div>
                                <div className="flex items-center pl-4">
                                    <AddCircleOutlineIcon className="text-blue-500" />
                                    <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg cursor-pointer">Add email address</p>
                                </div>
                            </div>
                        )}
                        
                        {profileData.mobile ? (
                            <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg cursor-pointer">Phone Number: {profileData.mobile}</p>
                        ) : (
                            <div>
                                <div className="flex items-center pl-4">
                                    <AddCircleOutlineIcon className="text-blue-500" />
                                    <p className="text-blue-500 hover:bg-gray-200 p-4 rounded-lg cursor-pointer">Add phone number</p>
                                </div>
                            </div>
                        )}

                        
                    </div>

                    <div className="border-b-2 mb-8"></div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700">About you</h2>

                        <div className="flex items-center pl-4 hover:bg-gray-200 rounded-lg">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 cursor-pointer p-4">Add a mini bio</p>
                        </div>
                        
                        <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
                            <p className="pl-4">💬 I'm chatty when I feel comfortable</p>
                            <p className="pl-4">🎵 I'll jam depending on the mood</p>
                            <p className="pl-4">🚬 Cigarette breaks outside the car are ok</p>
                            <p className="pl-4">🐾 I'll travel with pets depending on the animal</p>
                        </div>

                        <div className="flex items-center pl-4 hover:bg-gray-200 rounded-lg">
                            <AddCircleOutlineIcon className="text-blue-500" />
                            <p className="text-blue-500 cursor-pointer p-4">Edit travel preferences</p>
                        </div>
                        
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out"
                    >
                        Log Out
                    </button>

                    {isAddProfilePictureClicked && (
                        <AddProfilePicture 
                            toggleAddProfilePicturePopup={toggleAddProfilePicturePopup}
                            handleFileChange={handleFileChange}
                        />
                    )}

                    {isEditPersonalDetailsClicked && (
                        <EditPersonalDetails 
                            profileData={profileData}
                            toggleEditProfilePopup={toggleEditProfilePopup}
                            toggleFullNamePopup={toggleFullNamePopup}
                            toggleDateOfBirthPopup={toggleDateOfBirthPopup}
                            togglePhoneNumberPopup={togglePhoneNumberPopup}
                        />
                    )}

                    {isFullNameClicked && (
                        <EditFullName 
                            toggleFullNamePopup={toggleFullNamePopup}
                            handleSave={handleSave}
                        />
                    )}

                    {isDateOfBirthClicked && (
                        <EditDateOfBirth 
                            handleSave={handleSave}
                            toggleDateOfBirthPopup={toggleDateOfBirthPopup}
                        />
                    )}

                    {isEmailClicked && (
                        <EditEmailAddress 
                            toggleEmailPopup={toggleEmailPopup}
                            handleSave={handleSave}
                        />
                    )}

                    {isPhoneNumberClicked && (
                        <EditPhoneNumber 
                            togglePhoneNumberPopup={togglePhoneNumberPopup}
                            handleSave={handleSave}
                        />
                    )}

                </div>
            ) : (
                <div>Loading profile data...</div>
            )}
        </div>
    );
};

export default Profile;