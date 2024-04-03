import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => { 
    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
            <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center' }}> {/* Add justifyContent here */}
                <li style={{ marginRight: '10px' }}>
                    <Link to="/login" style={{ color: '#f466ad', fontSize: '20px' }}>Login</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/register" style={{ color: '#f466ad', fontSize: '20px' }}>Register</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/profile" style={{ color: '#f466ad', fontSize: '20px' }}>Profile</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/browse" style={{ color: '#f466ad', fontSize: '20px' }}>Browse</Link>
                </li>
                <li style={{ marginRight: '10px' }}>
                    <Link to="/parties" style={{ color: '#f466ad', fontSize: '20px' }}>Parties</Link>
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;
