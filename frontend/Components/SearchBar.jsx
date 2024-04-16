import React, { useState, useEffect } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const searchSpotify = async () => {
        const tokenResponse = await fetch('http://localhost:3000/token');
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.token;

        const response = await fetch(`https://api.spotify.com/v1/search?q=${debouncedTerm}&type=album`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        setResults(data.albums.items);
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedTerm !== '') {
            searchSpotify();
        }
    }, [debouncedTerm]);

    return (
        <div>
            <input type="text" onChange={handleSearch} />
            <select>
                {results.map((result, index) => (
                    <option key={index} value={result.id}>{result.name}</option>
                ))}
            </select>
        </div>
    );
};

export default SearchBar;