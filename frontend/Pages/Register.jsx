import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import cassetts from '../assets/cassetts.jpg';

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
    <div className="register-container">
    <div className="image-container">
      <img src={cassetts} alt="cassetts" />
    </div>
    <div className="form-container">
  <h1 style={{marginBottom: '140px'}}>Register</h1>
  <form onSubmit={onSubmit}>
    <div>
      <label style={{fontSize: '24px'}}>Username:</label>
      <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div>
      <label style={{fontSize: '24px'}}>Email:</label>
      <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div>
      <label style={{fontSize: '24px'}}>Password:</label>
      <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <div>
      <label style={{fontSize: '24px'}}>Confirm Password:</label>
      <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
    </div>
    <div>
      <input type="submit" value="Register" />
    </div>
  </form>
</div>
  </div>
);
};

export default Register;