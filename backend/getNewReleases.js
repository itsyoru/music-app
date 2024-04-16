import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getValidToken } from './getToken.js'; // Import the getValidToken function

const port = 3001;
const app = express();
app.use(cors());

app.get('/new-releases', async (req, res) => { // Make the callback async
    const accessToken = await getValidToken(); // Get the access token

    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/browse/new-releases',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const newReleasesData = response.data.albums.items;
        const firstSixReleases = newReleasesData.slice(0, 6); // Get the first 6 items
        const formattedData = firstSixReleases.map(album => ({
            id: album.id,
            name: album.name,
            artists: album.artists.map(artist => artist.name),
            release_date: album.release_date,
            cover_art: album.images[0].url
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