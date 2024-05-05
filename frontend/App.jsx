import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Browse from './Pages/Browse'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Register from './Pages/Register'
import Parties from './Pages/Parties'
import Partychat from './Pages/Partychat'
import CreateAParty from './Pages/CreateAParty'

const App = ()  => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Parties" element={<Parties />} />
        <Route path="/Parties/:partyName" element={<Parties />} /> {/* Update this line */}
        <Route path="/Partychat/:roomId" element={<Partychat/>}/>
        <Route path="/CreateAParty" element={<CreateAParty />} />
        <Route path="/profile/:username" element={<Profile />} />

      </Routes>
    </Router>
  );

}; 

export default App; 
