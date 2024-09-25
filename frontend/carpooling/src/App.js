import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import MenuBar from "./components/MenuBar";
import Profile from "./components/Profile";
import Rides from "./components/Rides";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      <BrowserRouter>
          <MenuBar user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/signin" element={<SignIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/profile" element={<Profile setUser={setUser}/>} />
          </Routes>
          
      </BrowserRouter>
        
    </div>
  );
}

export default App;
