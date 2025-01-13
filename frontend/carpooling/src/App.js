import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Your imports
import Home from "./components/Home";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/account_creation/SignUp";
import MenuBar from "./components/MenuBar";
import Profile from "./components/profile_management/Profile";
import Rides from "./components/rides/Rides";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import RideDetail from "./components/rides/RideDetail";
import CreateRide from "./components/ride_creation/CreateRide";
import PaymentForm from "./components/booking/PaymentForm";
import TripConfirmation from "./components/booking/TripConfirmation";
import DriverLocationTracker from "./components/gps_tracking/DriverLocationTracker";
import ViewDriverLocation from "./components/gps_tracking/ViewDriverLocation";
import YourRides from "./components/profile_management/YourRides";
import RegisterVehicle from "./components/profile_management/RegisterVehicle";
import ChatApp from "./components/communication/ChatApp";
import NotificationListener from "./components/communication/NotificationListener";
import ChatBubble from "./components/communication/ChatBubble";
import ChatbotComponent from "./components/communication/ChatbotComponent";

// 1) Import your WebSocketProvider
import { WebSocketProvider } from "./components/communication/WebSocketProvider";

const stripePromise = loadStripe(
    "pk_test_51QIWPCEaMiQXGjyX1GMqULAWqRw5tdO5wxBQIuJ3sJyn6IJWlHx7W3qAIeBQrWepCH2hyMsP9mpJBSY617w7htKU003fDfYVGj"
);

const App = () => {
    const [user, setUser] = useState(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    return (
        <div>
            <Elements stripe={stripePromise}>
                <BrowserRouter>
                    {/* 2) Wrap your app in WebSocketProvider to have ONE connection */}
                    <WebSocketProvider user={user}>
                        {/* 3) If you want ride notifications system-wide, keep NotificationListener */}
                        <NotificationListener user={user} />

                        <MenuBar setUser={setUser} user={user} />

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/create-ride" element={<CreateRide user={user} />} />
                            <Route path="/rides" element={<Rides />} />
                            <Route path="/ride-detail/:rideId" element={<RideDetail user={user} />} />
                            <Route path="/signin" element={<SignIn setUser={setUser} />} />
                            <Route path="/signin/forgot-password" element={<ForgotPassword />} />
                            <Route path="/account/reset-password" element={<ResetPassword />} />
                            <Route path="/signup" element={<SignUp setUser={setUser} />} />
                            <Route path="/profile" element={<Profile setUser={setUser} />} />
                            <Route path="/track-driver-location/:rideId" element={<DriverLocationTracker />} />
                            <Route path="/view-driver-location/:rideId" element={<ViewDriverLocation />} />
                            <Route path="/payment" element={<PaymentForm />} />
                            <Route
                                path="/confirmation/ride/:rideId"
                                element={<TripConfirmation user={user} />}
                            />
                            <Route path="/your-rides" element={<YourRides />} />
                            <Route path="/chat/:rideId" element={<ChatApp />} />
                            <Route path="/register-vehicle" element={<RegisterVehicle />} />
                        </Routes>
                        {/* Chat Bubble and Chatbot */}
                        <ChatBubble onClick={() => setIsChatbotOpen(true)} />
                        {isChatbotOpen && (
                            <ChatbotComponent onClose={() => setIsChatbotOpen(false)} />
                        )}
                    </WebSocketProvider>
                </BrowserRouter>
            </Elements>
        </div>
    );
};

export default App;
