import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getValidToken } from './getToken.js'; // replace with the actual path to your file

const port = 3002;
const app = express();
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});