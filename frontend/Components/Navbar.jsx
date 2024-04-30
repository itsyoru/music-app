import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => { 
    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
           <Link to="/" style={{ position: 'absolute', left: '70px', top: '22px', fontSize: '20px', color: '#616336' }}>
                DEN
            </Link>
            <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center', paddingTop: '10px' }}>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/login" style={{ color: '#616336', fontSize: '20px' }}>Login</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/register" style={{ color: '#616336', fontSize: '20px' }}>Register</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/profile" style={{ color: '#616336', fontSize: '20px' }}>Profile</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/browse" style={{ color: '#616336', fontSize: '20px' }}>Browse</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/createaparty" style={{ color: '#616336', fontSize: '20px' }}>Parties</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;