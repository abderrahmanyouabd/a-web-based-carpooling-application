import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = ({ setUser }) => {
    const [step, setStep] = useState(1);
    const [params, setParams] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        //gender: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({ ...params, [name]: value });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    const handleContinue = () => {
        if (step === 1){
            if (!params.email || !isValidEmail(params.email)){
                setErrorMessage('Please enter a valid email address.');
                return;
            }
            setErrorMessage("");
            setStep(2);
        }    

        if(step === 2 && params.firstName && params.lastName) setStep(3);

        if(step === 3 && params.dateOfBirth) {
            const age = calculateAge(params.dateOfBirth);
            if (age < 18){
                setErrorMessage('You must be at least 18 years old to sign up.');
                return;
            }
            setErrorMessage("");
            setStep(4)
        };

        if(step === 4 && params.password) {
            setStep(5)
            handleSignUp();
        }

    };

    const handleSignUp = async () => {
        const fullName = `${params.firstName} ${params.lastName}`;

        const userData = {...params, fullName};

        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok){
                console.log("User's input values: ", userData);
                console.log("JWT Token: ", data.jwt);
                setUser({ fullName: fullName });
                localStorage.setItem('jwtToken', data.jwt);
                navigate('/');
            } else {
                setErrorMessage(data.message || 'Sign up failed email address already used :(');
            }
        } catch (error) {
            setErrorMessage('An error occurred while signing up. Please try again later.');
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center mt-10">

                {step === 1 && (

                    <>
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your email address?</h1>
                
                        <input 
                            type="text"
                            id="email"
                            name="email"
                            value={params.email}
                            onChange={handleParamChange}
                            placeholder="Email"
                            className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your name?</h1>
                
                        <input 
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={params.firstName}
                            onChange={handleParamChange}
                            placeholder="First Name"
                            className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        <input          
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={params.lastName}
                            onChange={handleParamChange}
                            placeholder="Last Name"
                            className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">What's your date of birth?</h1>

                        <input 
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={params.dateOfBirth}
                            onChange={handleParamChange}
                            placeholder="DD/MM/YY"
                            className="font-bold mt-10 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

                {/* {step === 4 && (

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
                )} */}

                {step === 4 && (

                    <>
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-10">Define your password</h1>

                        <p className="p-8 text-gray-500">It must have at least 8 characters, 1 letter, 1 number and 1 special character.</p>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={params.password}
                            onChange={handleParamChange}
                            placeholder="Password"
                            className="font-bold mt-5 py-2 px-5 w-[20rem] md:w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

                
                {errorMessage && (
                    <div className="text-red-600 mt-5">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>  
    );
};

export default SignUp;
