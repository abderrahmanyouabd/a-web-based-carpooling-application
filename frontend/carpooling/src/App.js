import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import MenuBar from "./components/MenuBar";
import Profile from "./components/Profile";
import Rides from "./components/Rides";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import RideDetail from "./components/RideDetail";
import CreateRide from "./components/CreateRide";
import PaymentForm from "./components/PaymentForm";
import TripConfirmation from "./components/TripConfirmation";


const stripePromise = loadStripe('pk_test_51QIWPCEaMiQXGjyX1GMqULAWqRw5tdO5wxBQIuJ3sJyn6IJWlHx7W3qAIeBQrWepCH2hyMsP9mpJBSY617w7htKU003fDfYVGj');

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <div>
            <Elements stripe={stripePromise}>
                <BrowserRouter>
                    <MenuBar setUser={setUser} user={user} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-ride" element={<CreateRide user={user}/>} />
                        <Route path="/rides" element={<Rides />} />
                        <Route path="ride-detail" element={<RideDetail user={user} />} />
                        <Route path="/signin" element={<SignIn setUser={setUser} />} />
                        <Route path="/signin/forgot-password" element={<ForgotPassword />} />
                        <Route path="/account/reset-password" element={<ResetPassword />} />
                        <Route path="/signup" element={<SignUp setUser={setUser} />} />
                        <Route path="/profile" element={<Profile setUser={setUser}/>} />
                        <Route path="/payment" element={<PaymentForm /> } />
                        <Route path="/confirmation/ride/:rideId" element={<TripConfirmation />} />
                    </Routes>
                </BrowserRouter>
            </Elements>
        </div>
    );
}

export default App;