import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import headphones from '../assets/headphones.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('username')) {
      window.alert('You are already logged in!');
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const response = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('username', username);
      navigate('/');
    } else {
      console.error('Login failed:', await response.text());
    }
  };

  return (
    <div className="register-container">
      <div className="image-container">
        <img src={headphones} alt="headphones" style={{width: '80%', height: 'auto'}} />
      </div>
      <div className="form-container">
        <h1 style={{marginBottom: '140px'}}>Log In</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label style={{fontSize: '24px'}}>Username:</label>
            <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label style={{fontSize: '24px'}}>Password:</label>
            <input style={{width: '200px', height: '30px', fontSize: '16px'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <input type="submit" value="Log In" />
          </div>
        </form>
        <div style={{marginTop: '20px'}}>
          <p>Don't have an account? <Link to="/register">Register here!</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;