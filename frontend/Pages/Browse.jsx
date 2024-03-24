import '../App.css';

import React, { useState, useEffect } from 'react';

const Browse = () => {
    const [newReleases, setNewReleases] = useState([]);
    const [top10, setTop10] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/new-releases')
            .then(response => response.json())
            .then(data => setNewReleases(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/top10')
            .then(response => response.json())
            .then(data => setTop10(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Welcome to DEN!</h1>
            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>New Releases</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {newReleases.map((release, index) => (
                    <div key={index} style={{ margin: '10px' }}> 
                        <img src={release.cover_art} alt={release.name} className="album-cover" />
                        <p className="album-details">{release.name}</p>
                        <p className="album-details" style={{ marginTop: '5px' }}>{release.artists.join(', ')}</p>
                    </div>
                ))}
            </div>
            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Top 10</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {top10.map((track, index) => (
                    <div key={index} style={{ margin: '10px' }}> 
                        <img src={track.cover_art} alt={track.name} className="album-cover" />
                        <p className="album-details">{track.name}</p>
                        <p className="album-details" style={{ marginTop: '5px' }}>{track.artists.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Browse;