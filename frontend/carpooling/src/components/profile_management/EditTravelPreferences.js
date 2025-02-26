import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";

const EditTravelPreferences = ({ toggleEditTravelPreferencesPopup }) => {
    const [preferences, setPreferences] = useState([]);
    const [customOption, setCustomOption] = useState('');
    const [preferenceOptions, setPreferenceOptions] = useState([
        "I am talkative when I am comfortable",
        "I like to play music during the trip",
        "I don't mind dropping a person within 5 minutes of drive",
        "I prefer quiet rides",
        "I provide charging ports",
        "I hate listening to music",
        "People are means nowadays, isn't it?",
        "We are the best person",
        "We are gonna have a great time",
        "I can drive as fast as a speed of light"
    ]);
    
    const handleAddCustomOption = (e) => {
        if (customOption.trim() && !preferenceOptions.includes(customOption)) {
            setPreferenceOptions((prev) => [...prev, customOption]);
            handlePreferenceChange(customOption);
            setCustomOption('');
        }
    };

    const handlePreferenceChange = (preference) => {
        setPreferences((prev) =>
            prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference]
        );
    };

    // Handle save to backend in this component
    
    return (
        <div className="bg-white flex justify-center fixed inset-0 z-50">
            <div className="w-full max-w-lg h-auto p-8 relative">

                <div className="text-right">
                    <button 
                        onClick={toggleEditTravelPreferencesPopup}
                        className="text-3xl text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your ride preferences?</h1>
                                
                    <div className="max-h-[500px] w-full overflow-y-auto border border-black border-1 p-8 mt-10 rounded-md shadow-sm bg-white">
                        <FormGroup className="space-y-4">
                            {preferenceOptions.map((option, index) => (
                                <FormControlLabel 
                                    key={index}
                                    control={
                                        <Checkbox 
                                            checked={preferences.includes(option)}
                                            onChange={() => handlePreferenceChange(option)}
                                            />
                                    }
                    
                                    label={
                                        <span className="text-lg md:text-xl text-gray-800 font-[Inter]">
                                            {option}
                                        </span>
                                                    
                                    }
                                />
                            ))}
                        </FormGroup>
                    </div>

                    <div className="flex flex-col space-y-2 mt-5">
                        <TextField
                            value={customOption}
                            onChange={(e) => setCustomOption(e.target.value)}
                            label="Add custom preference"
                            variant="outlined"
                            size="small"
                            className="mb-4"
                        />
                        <Button
                            onClick={handleAddCustomOption}
                            variant="contained"
                            color="primary"
                            disabled={!customOption.trim()}
                        >
                            Add Preference
                        </Button>
                    </div>
                    

                    <button 
                        className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditTravelPreferences;