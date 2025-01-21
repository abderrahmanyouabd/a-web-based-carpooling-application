import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const SignUp = ({ setUser }) => {
    const [step, setStep] = useState(1);
    const [params, setParams] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
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

        if(step === 4 && params.gender) {

            setStep(5)
        }

        if(step === 5 && params.password){
            handleSignUp();
        }

    };

    const handleSignUp = async () => {
        const fullName = `${params.firstName} ${params.lastName}`;

        const userData = {...params, fullName};

        try {
            const response = await fetch(`${BACKEND_API_BASE_URL}/auth/signup`, {
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
                
                localStorage.setItem('jwtToken', data.jwt);

                const token = data.jwt;
                const profileResponse = await fetch(`${BACKEND_API_BASE_URL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setUser(profileData);
                    navigate('/'); 
                } else {
                    setErrorMessage("Failed to fetch profile data after login.");
                }
                
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
                    <Step1 
                        params={params} 
                        handleParamChange={handleParamChange}
                        handleContinue={handleContinue}
                    />
                )}

                {step === 2 && (
                    <Step2 
                        params={params}
                        handleParamChange={handleParamChange}
                        handleContinue={handleContinue}
                    />
                )}

                {step === 3 && (
                    <Step3 
                        params={params}
                        handleParamChange={handleParamChange}
                        handleContinue={handleContinue}
                    />
                )}

                {step === 4 && (
                    <Step4 
                        params={params}
                        setParams={setParams}
                        setStep={setStep}
                        step={step}
                    />
                )}

                {step === 5 && (
                    <Step5 
                        params={params}
                        handleParamChange={handleParamChange}
                        handleContinue={handleContinue}
                    />
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
