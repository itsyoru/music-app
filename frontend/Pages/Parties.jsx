import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import SearchBar from '../Components/SearchBar'; 

function Parties() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/token')
            .then(response => {
                setToken(response.data.token);
                localStorage.setItem('spotifyAuthToken', response.data.token);
                console.log('Spotify Auth Token:', response.data.token);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = localStorage.getItem('spotifyAuthToken');
            if (token) {
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(token); }
                });
    
                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error(message); });
                player.addListener('authentication_error', ({ message }) => { console.error(message); });
                player.addListener('account_error', ({ message }) => { console.error(message); });
                player.addListener('playback_error', ({ message }) => { console.error(message); });
    
                player.addListener('player_state_changed', state => { console.log(state); });
    
                player.connect();
            }
        };
    }, []);

    const [currentAlbum, setCurrentAlbum] = React.useState('1nTvIQEXvygqSIqc2vuwAz'); // Default album

    const handleAlbumSelect = (albumId) => {
        setCurrentAlbum(albumId);
    };

    return (
    <div>
        <h1>Welcome to DEN!</h1>
        <p>Welcome to the parties page.
            This page is under construction! </p>
            <SearchBar onAlbumSelect={handleAlbumSelect} />
            <iframe src={`https://open.spotify.com/embed/album/${currentAlbum}`} width="800" height="800" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        
    </div>
);
}

export default Parties;