import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import cassetts from '../assets/cassetts.jpg';
import Navbar from '../Components/Navbar';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    console.log('Form submitted');

    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Server response:', data);

    
      navigate('/');
    } else {
      
      const error = await response.text();
      console.error('Registration error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        {/* <div className="image-container">
          <img src={cassetts} alt="cassetts" />
        </div> */}
        <div className="form-container">
          <h1 style={{marginBottom: '50px', fontSize:'30px', fontFamily:'arial'}}>REGISTER</h1>
          <form onSubmit={onSubmit}>
            <div>
              <label style={{fontSize: '18px'}}>USERNAME:</label>
              <input style={{width: '200px', height: '30px', fontSize: '16px', backgroundColor: 'white', color: 'black'}} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label style={{fontSize: '18px'}}>EMAIL:</label>
              <input style={{width: '200px', height: '30px', fontSize: '16px', backgroundColor: 'white', color: 'black'}} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{fontSize: '18px'}}>PASSWORD:</label>
              <input style={{width: '200px', height: '30px', fontSize: '16px', backgroundColor: 'white', color: 'black'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label style={{fontSize: '18px'}}>CONFIRM PASSWORD:</label>
              <input style={{width: '200px', height: '30px', fontSize: '16px', backgroundColor: 'white', color: 'black'}} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div>
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
  };
  
  export default Register;