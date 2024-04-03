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
            <h1>Browse...</h1>
            <p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '60px' }}>New Releases</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                {newReleases.map((release, index) => (
                    <div key={index} style={{ margin: '10px', width: 'calc(16.66% - 20px)', overflow: 'hidden' }}> 
                        <img src={release.cover_art} alt={release.name} className="album-cover" />
                        <p className="album-details" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{release.name}</p>
                        <p className="album-details" style={{ marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{release.artists.join(', ')}</p>
                    </div>
                ))}
            </div>
            <p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '20px' }}>Top 10</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {top10.map((release, index) => (
                    <div key={index} style={{ margin: '10px', width: 'calc(20% - 20px)', overflow: 'hidden' }}> 
                        <img src={release.cover_art} alt={release.name} className="album-cover" />
                        <p className="album-details" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{release.name}</p>
                        <p className="album-details" style={{ marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{release.artists.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Browse;