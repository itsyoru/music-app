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
                style={{ backgroundColor: '#f0f3fa', marginRight: '10px', fontSize: '18px', padding: '4px' }} // Increase font size and padding
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className = "search-button" onClick={() => console.log('Search clicked')}>Search</button>
        </div>
    );
};

export default SearchBar;