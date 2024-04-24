import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import SearchBar from '../Components/SearchBar'; 
import { useNavigate } from 'react-router-dom';

function Parties() {
    const [token, setToken] = useState(null);
    const [parties, setParties] = useState({}); // Parties state
    const [joinPartyId, setJoinPartyId] = useState(''); // State for the party ID to join
    const [currentPartyId, setCurrentPartyId] = useState(null); // State for the current party ID
    const Nav = useNavigate();
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

    const createParty = () => {
        const partyId = Date.now().toString();
        var partyName = prompt("Enter party name");
        if (!partyName) {
            partyName = partyId
            return;
        }
        setParties({
            ...parties,
            [partyId]: {
                name: partyName,
                album: currentAlbum,
                users: []
            }
        });
        setCurrentPartyId(partyId);
        Nav(`/Partychat/${partyId}`);
    };

    const joinParty = () => {
        if (parties[joinPartyId]) {
            setParties({
                ...parties,
                [joinPartyId]: {
                    ...parties[joinPartyId],
                    users: [...parties[joinPartyId].users, 'userId']
                }
            });
        } else {
            console.error('Party not found');
        }
    };

    return (
        <div>
            <h1>Welcome to DEN!</h1>
            <p>Welcome to the parties page. This page is under construction!</p>
            <SearchBar onAlbumSelect={handleAlbumSelect} />
            <button onClick={createParty}>Create Party</button>
            {currentPartyId && <p>Party ID: {currentPartyId}</p>}
            <input type="text" value={joinPartyId} onChange={e => setJoinPartyId(e.target.value)} placeholder="Enter party ID" />
            <button onClick={joinParty}>Join Party</button>
            <iframe src={`https://open.spotify.com/embed/album/${currentAlbum}`} width="800" height="800" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
    );
}

export default Parties;