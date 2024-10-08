import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; 
import { IconButton, Button, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );
        

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage('');
    }

    const sendResetPasswordEmail = async () => {

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/reset?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Email sent successfully: ", data);
                setOpen(true);
                setTimeout(() =>{
                    navigate("/signin");
                }, 3000);
                
            } else {
                console.error("Error: ", data.error);
                setErrorMessage("Email is not found in our database.");
            }
        } catch (error) {
            console.error("Network error: ", error);
            setErrorMessage("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User's Input: " + email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        sendResetPasswordEmail();
    }

    return (
        <div> 
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-3xl font-extrabold text-gray-700">What’s the email associated with your account?</h1>
                <h1 className="text-3xl font-extrabold text-gray-700">We’ll email you a link to reset your password.</h1>

                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Reset password email has sent successfully"
                    action={action}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    ContentProps={{
                        sx: {
                            fontSize: '1.2rem',
                            padding: '20px',
                            width: '500px',
                            height: '150px',
                        },
                    }}
                />

                {errorMessage && (
                    <p className="text-red-600 mt-6">{errorMessage}</p>
                )}

                { loading ? ( 
                    <div className="flex flex-col justify-center items-center mt-5 ">
                        <ClipLoader color="#3b82f6" loading={loading} size={100} />
                        <p className="text-xl font-extrabold mt-3">Sending email...</p>
                    </div>
                ) : (

                    <>  
                        <input 
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            className="font-bold mt-10 py-2 px-5 w-[32rem] h-12 bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-100 focus:border-indigo-200 sm:text-sm"
                        />

                        <button 
                            onClick={handleSubmit}
                            className="mt-5 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                        >
                            Send a reset link
                        </button>

                        
                    </>
                )}
            </div>
            
        </div>
    )
}

export default ForgotPassword;