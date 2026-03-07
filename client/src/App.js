import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importing all your pages
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import WorkerDashboard from './Pages/WorkerDashboard'; // <-- 1. Added Worker Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} /> {/* <-- 2. Added Worker Route */}
      </Routes>
    </Router>
  );
}

export default App;