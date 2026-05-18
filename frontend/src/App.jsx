import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllShops from "./pages/AllShops";
import Login from './pages/Login';
import Signup from './pages/SignUp';
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-shops" element={<AllShops />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup/>}/>
          <Route path="/verify-otp" element={<VerifyOtp/>}/>

          <Route path="*" element={<div className="p-5 font-bold text-center">404 - Page Not Found! Paths mismatched check pattern config.</div>} />
      </Routes>
    </div>
  );
}

export default App;