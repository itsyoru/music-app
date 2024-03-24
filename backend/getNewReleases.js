import express from 'express';
import axios from 'axios';
import cors from 'cors';

const port = 3001;
const app = express();
app.use(cors());

const accessToken = 'BQDi3UNYXRAlvRzTUVySjxMbNgvg2IWrILFOjHsLQ5j6ZdKzbs2cb_3AmebwmXN_wjCqxsDB82rDlp5_9Z60VQ4VeIg1zmrK47LIj4eRm1ILdjOQU-c';

app.get('/new-releases', (req, res) => {
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