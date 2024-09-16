import React, { useState } from "react";
import MenuBar from "./MenuBar";

const SignUp = () => {
    const [step, setStep] = useState(1);
    const [params, setParams] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        password: ''
    });

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({ ...params, [name]: value });
    };

    const handleContinue = () => {
        if (step === 1 && params.email) {
            setStep(2);
        }

        if(step === 2 && params.firstName && params.lastName) {
            setStep(3);
        }

        if(step === 3 && params.dateOfBirth) {
            setStep(4);
        }

        if(step === 5 && params.password) {
            console.log("User's input values: ", params);
        }

    };

    return (
        <div>
            <MenuBar />
            <div className="flex flex-col items-center mt-10">

                {step === 1 && (

                    <>
                        <h1 className="text-3xl font-extrabold text-gray-700">What's your email address?</h1>
                
                        <input 
                            type="text"
                            id="email"
                            name="email"
                            value={params.email}
                            onChange={handleParamChange}
                            placeholder="Email"
                            className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        <button 
                            onClick={handleContinue}
                            className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                        >
                            Continue
                        </button>
                    </>
                    
                )}

                {step === 2 && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-700">What's your name?</h1>
                
                        <input 
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={params.firstName}
                            onChange={handleParamChange}
                            placeholder="First Name"
                            className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        <input          
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={params.lastName}
                            onChange={handleParamChange}
                            placeholder="Last Name"
                            className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        {(params.firstName && params.lastName) && (
                            <button 
                                onClick={handleContinue}
                                className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                            >
                                Continue
                            </button>
                        )}
                        
                    </>
                )}

                {step === 3 && (

                    <>
                        <h1 className="text-3xl font-extrabold text-gray-700">What's your date of birth?</h1>

                        <input 
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={params.dateOfBirth}
                            onChange={handleParamChange}
                            placeholder="DD/MM/YY"
                            className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        {params.dateOfBirth && (
                            <button 
                                onClick={handleContinue}
                                className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                            >
                                Continue
                            </button>
                        )}
                        
                    </>

                )}

                {step === 4 && (

                    <>
                        <h1 className="text-3xl font-extrabold text-gray-700">How would you like to be addressed?</h1>

                        <div className="flex flex-col mt-5 space-y-4">
                            <div 
                                className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                                onClick={() => {
                                    setParams({ ...params, gender: 'female'});
                                    setStep(step + 1);
                                }}
                            >
                                <span className="w-[32rem] font-bold text-gray-700">Mrs. / Ms.</span>
                                <span>&#8250;</span>
                            </div>

                            <div 
                                className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                                onClick={() => { 
                                    setParams({ ...params, gender: 'male'});
                                    setStep(step + 1);
                                }}
                            >
                                <span className="w-[32rem] font-bold text-gray-700">Mr.</span>
                                <span>&#8250;</span>
                            </div>

                            <div 
                                className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                                onClick={() => {
                                    setParams({ ...params, gender: 'neither'});
                                    setStep(step + 1);
                                }}
                            >
                                <span className="w-[32rem] font-bold text-gray-700">I'd rather not say</span>
                                <span>&#8250;</span>
                            </div>
                        </div>
                    </>
                )}

                {step === 5 && (

                    <>
                        <h1 className="text-3xl font-extrabold text-gray-700 mb-10">Define your password</h1>

                        <p className="text-gray-500">It must have at least 8 characters, 1 letter, 1 number and 1 special character.</p>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={params.password}
                            onChange={handleParamChange}
                            placeholder="Password"
                            className="font-bold mt-5 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        {params.password && (
                            <button 
                                onClick={handleContinue}
                                className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                            >
                                Continue
                            </button>
                        )}
                    </>

                )}
                
            </div>
        </div>  
    );
};

export default SignUp;
