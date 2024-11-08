import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import DriverLocationTracker from "./components/DriverLocationTracker";
import ViewDriverLocation from "./components/ViewDriverLocation";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      <BrowserRouter>
          <MenuBar user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-ride" element={<CreateRide user={user}/>} />
            <Route path="/rides" element={<Rides />} />
            <Route path="ride-detail" element={<RideDetail />} />
            <Route path="/signin" element={<SignIn setUser={setUser} />} />
            <Route path="/signin/forgot-password" element={<ForgotPassword />} />
            <Route path="/account/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/profile" element={<Profile setUser={setUser}/>} />
            <Route path="/track-driver-location" element={<DriverLocationTracker />} />
            <Route path="/view-driver-location" element={<ViewDriverLocation />} />
          </Routes>
          
      </BrowserRouter>
        
    </div>
  );
}

export default App;
