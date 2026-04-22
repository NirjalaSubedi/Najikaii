import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllShops from "./pages/AllShops";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-shops" element={<AllShops />} />
      </Routes>
    </div>
  );
}

export default App;