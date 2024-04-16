import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getValidToken } from './getToken.js'; 

const port = 3000;
const app = express();
app.use(cors());

app.get('/new-releases', async (req, res) => { 
    const accessToken = await getValidToken(); 

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

const albumIds = ['79dL7FLiJFOO0EoehUHQBv', '0tpIUAzCeUkoV4u2r5NrQr', '6tG8sCK4htJOLjlWwb7gZB', '3mH6qwIy9crq0I9YQbOuDf', '1VCTWaze9kuY5IDlbtR5p0', '7wJTn94PWzZ3zE0lg3qhld']; // replace with your actual album IDs

app.get('/albums', async (req, res) => {
  try {
    const accessToken = await getValidToken();
    const responses = await Promise.all(albumIds.map(albumId => 
      axios({
        method: 'get',
        url: `https://api.spotify.com/v1/albums/${albumId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    ));

    const formattedData = responses.map(response => {
      const albumData = response.data;
      return {
        name: albumData.name,
        artists: albumData.artists.map(artist => artist.name),
        release_date: albumData.release_date,
        tracks: albumData.tracks.items.map(track => track.name),
        cover_art: albumData.images[0].url
      };
    });
    res.send(formattedData);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

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