import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Browse from './Pages/Browse'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Register from './Pages/Register'

const App = ()  => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );

}; 

export default App; 
