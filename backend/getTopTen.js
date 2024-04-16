import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getValidToken } from './getToken.js'; 

const port = 3000;
const app = express();
app.use(cors());

app.get('/top-ten', async (req, res) => { 
    const accessToken = await getValidToken(); 

    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbLp5XoPON0wI',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const topTenData = response.data.tracks.items;
        const formattedData = topTenData.map(track => ({
            id: track.track.id,
            name: track.track.name,
            artists: track.track.artists.map(artist => artist.name),
            album: track.track.album.name,
            cover_art: track.track.album.images[0].url
        }));
        res.send(formattedData);
    })
    .catch(error => {
        res.status(500).send(error.toString());
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});