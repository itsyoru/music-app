import express from 'express';
import axios from 'axios';
import cors from 'cors';

const port = 3000;
const app = express();
app.use(cors());

const accessToken = 'BQB5rJdvSC_7J1zdr4IOatH9UQEspOj27FVwjc8ztFanMZp0GWnJ_cOfvKC8ywD7BUaYCgV9KXUNz_bzkxg2gPyVLQqVgZ5x-93z_MwGCJFOMz7arf8';
const playlistId = '37i9dQZEVXbLp5XoPON0wI'; // Replace with your actual playlist ID

app.get('/top10', (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/playlists/${playlistId}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const playlistData = response.data.tracks.items;
        const top10Tracks = playlistData.slice(0, 10); // Get the first 10 items
        const formattedData = top10Tracks.map(track => ({
            name: track.track.name,
            artists: track.track.artists.map(artist => artist.name),
            album: track.track.album.name,
            release_date: track.track.album.release_date,
            cover_art: track.track.album.images[0].url
        }));
        res.send(formattedData);
    })
    .catch(error => {
        res.status(500).send(error.toString());
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
