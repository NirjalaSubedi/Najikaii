import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllShops from "./pages/AllShops";
import Login from './pages/Login';
import Signup from './pages/SignUp';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-shops" element={<AllShops />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </div>
  );
}

export default App;