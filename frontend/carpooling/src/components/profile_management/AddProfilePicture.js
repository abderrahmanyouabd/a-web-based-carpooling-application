import React from "react";
import CarPoolCommercial from "../../CarPoolingPictures/carpool_commercial2.png"

const AddProfilePicture = ({ toggleAddProfilePicturePopup, handleFileChange}) => {

    return (
        <div className="bg-white flex justify-center fixed inset-0 z-50">

            <div className="w-full max-w-lg h-auto p-8 relative">

                <div className="text-right">
                    <button 
                        onClick={toggleAddProfilePicturePopup}
                        className="text-3xl text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                        
                <div className="flex items-center mt-8">
                    
                    <div className="w-1/3">
                        <img 
                            src={CarPoolCommercial}
                            alt="Profile Preview"
                            className="rounded-full w-32 h-32 object-cover mb-4"
                        />
                    </div>
                    
                    
                    <div className="flex flex-col mt-8 w-2/3 ml-16">
                        <p className="text-2xl font-bold text-center">
                            Don't wear sunglasses, look straight ahead and make sure you're alone.
                        </p>

                        <button 
                            className="bg-blue-500 text-white py-2 px-2 rounded mt-4"
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Choose a profile picture
                        </button>
                        <input 
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                </div>

            </div>

        </div>
    )
}

export default AddProfilePicture;