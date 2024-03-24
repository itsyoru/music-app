import React, { useState } from 'react';
import '../App.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Perform search logic here
    };

    return (
        <div>
            <input
                type="text"
                style={{ backgroundColor: 'black', marginRight: '10px' }} // Add this line to change the background color
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className = "search-button" onClick={() => console.log('Search clicked')}>Search</button>
        </div>
    );
};

export default SearchBar;