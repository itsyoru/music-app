import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/browse" element={<Browse />} />
        <Route path="/register" element={<Register />}/>
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;