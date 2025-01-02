import React from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const EditPersonalDetails = ({profileData, toggleEditProfilePopup, toggleFullNamePopup, toggleDateOfBirthPopup, togglePhoneNumberPopup}) => {
    return (
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
                        <p onClick={toggleFullNamePopup} className="mb-10 text-blue-500 hover:bg-gray-200 rounded-lg p-4">
                            <span className="font-bold text-gray-500">
                                Full Name <br/>
                            </span>
                            {profileData.fullName}
                        </p>
                        <p onClick={toggleDateOfBirthPopup} className="mb-10 text-blue-500 hover:bg-gray-200 rounded-lg p-4">
                            <span className="font-bold text-gray-500">
                                Date Of Birth <br/>
                            </span>
                            {profileData.dateOfBirth}
                        </p>
                        <p className="mb-10 text-gray-500 hover:bg-gray-200 rounded-lg p-4 cursor-not-allowed">
                            <span className="font-bold text-gray-500">
                                Email Address <br/>
                            </span>
                            {profileData.email}
                        </p>
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
    )
}

export default EditPersonalDetails;