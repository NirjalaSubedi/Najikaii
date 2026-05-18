import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllShops from "./pages/AllShops";
import Login from './pages/Login';
import Signup from './pages/SignUp';
import VerifyOtp from "./pages/VerifyOtp";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from "./components/AdminLayout";
import Overview from "./pages/admin/Overview";

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
      
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Overview />} />
          </Route>

      </Routes>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
        toastStyle={{ 
          backgroundColor: "#white", 
          border: "1px solid #00B56A", 
          borderRadius: "12px",
          color: "#00B56A" 
        }}
        bodyStyle={{ 
          color: "#00B56A", 
          fontWeight: "bold",
          fontFamily: "sans-serif"
        }}
        
        progressStyle={{
          backgroundColor: "#00B56A"
        }}
      />

    </div>
  );
}

export default App;