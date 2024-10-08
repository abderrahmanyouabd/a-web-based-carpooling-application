import React, { useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Button, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        setErrorMessage("");
        e.preventDefault();
        console.log("User's Input: " + password);

        if (password.length <= 10){
            setErrorMessage('Password must be at least 10 characters long.');
            return;
        }

        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (!token) {
            setErrorMessage("Invalid token. Please try again.");
            return;
        }

        console.log("Token: " + token);

        try {
            setLoading(true);

            const response = await fetch('http://localhost:8080/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                    token: token
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Password reset successfully: ", data.message);
                setOpen(true);
                setTimeout(() => {
                    navigate("/signin");
                }, 2000);
                
            } else {
                console.error("Error: ", data.error);
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Network error: ", error);
            setErrorMessage("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            <div className="flex flex-col items-center mt-10">
                <h1 className="font-extrabold text-3xl text-gray-700 mb-10">Chose a new Password</h1>

                <p className="text-gray-500 mb-4">It must have at least 8 characters, 1 letter, 1 number and 1 special character.</p>

                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="New Password has been successfully changed"
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

                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    className="font-bold py-2 px-5 h-12 w-[32rem] bg-gray-200 rounded-xl shadow-sm focus:outline-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />

                {errorMessage && !loading && (
                    <p className="text-red-600 mt-2">{errorMessage}</p>
                )}

                <button 
                    onClick={handleSubmit}
                    className="mt-10 px-5 py-3 bg-blue-400 text-white rounded-[2rem] hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
            
        </div>
    )
}

export default ResetPassword;