import express from 'express';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import cors from 'cors';
import Review from './models/Reviews.js';
import Party from './models/Parties.js';
import { getValidToken } from './getToken.js'; 
import axios from 'axios';

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect('mongodb+srv://fkhan27:r2BPsC9bt8K49GE8@sysdesign.alwougr.mongodb.net/den?retryWrites=true&w=majority&appName=sysdesign', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Database connection error: ' + err));

    // Get a user's data
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Update a user's data
app.put('/users/:username', async (req, res) => {
    const { username } = req.params;
    const { bio, email, avatar } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = bio;
        user.email = email;
        user.avatar = avatar;


        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



app.post('/reviews', async (req, res) => {
    console.log(req.body);
    const { user, spotifyID, rating, comment, albumName, albumCoverArt } = req.body;

    const userDoc = await User.findOne({ username: user });

    if (!userDoc) {
        return res.status(400).json({ message: 'User not found' });
    }

    const newReview = new Review({
        user: userDoc._id, 
        spotifyID: spotifyID,
        albumName: albumName, // add this line
        albumCoverArt: albumCoverArt, // add this line
        rating: rating,
        comment: comment
    });

    try {
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ reviewedDate: -1 }).limit(3);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
});

app.get('/reviews/:username', async (req, res) => {
    const userDoc = await User.findOne({ username: req.params.username });

    if (!userDoc) {
        return res.status(400).json({ message: 'User not found' });
    }

    const reviews = await Review.find({ user: userDoc._id });

    res.json(reviews);
});


// Create a party
app.post('/party', async (req, res) => {
    const { name } = req.body;
    const party = await Party.findOne({ name });
    if (party) {
        return res.status(400).json({ error: 'Party already exists' });
    }
    const newParty = new Party({ name, users: [], chat: [], videoQueue: [] });
    const savedParty = await newParty.save();
    console.log('Saved party:', savedParty); // Log the saved party
    res.status(201).json({ message: 'Party created' });
});

// Join a party
app.put('/party/join', async (req, res) => {
    const { name, userId } = req.body;
    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }
    // Add user to party
    party.users.push(userId);
    await party.save();
    res.json(party);
});

// Get a party
app.get('/party/:name', async (req, res) => {
    const { name } = req.params;
    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
});

// Get all parties
app.get('/parties', async (req, res) => {
    try {
        const parties = await Party.find({});
        res.json(parties);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a video to a party's queue
app.post('/party/:name/videos', async (req, res) => {
    const { name } = req.params;
    const { id, title } = req.body;
    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }
    party.videoQueue.push({ id, title });
    await party.save();
    res.json(party);
});

// Remove a video from a party's queue
app.delete('/party/:name/videos/:id', async (req, res) => {
    const { name, id } = req.params;
    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }
    party.videoQueue = party.videoQueue.filter(video => video.id !== id);
    await party.save();
    res.json(party);
});


// Get the video queue for a party
app.get('/party/:name/videos', async (req, res) => {
    console.log('Request received for /party/:name/videos');
    const { name } = req.params;
    console.log('Name:', name);
    try {
        const party = await Party.findOne({ name });
        console.log('Party found:', party);
        if (!party) {
            return res.status(404).json({ error: 'Party not found' });
        }
        res.json(party.videoQueue);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/party/:name/currentVideo', async (req, res) => {
    const { name } = req.params;
    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }
    res.json({ video: party.videoQueue[0], currentTime: party.currentTime });
});

app.post('/party/:name/currentTime', async (req, res) => {
    const { name } = req.params;
    const { currentTime } = req.body;

    const party = await Party.findOne({ name });
    if (!party) {
        return res.status(404).json({ error: 'Party not found' });
    }

    party.currentTime = currentTime;
    await party.save();

    res.json({ message: 'Current time updated' });
});

app.put('/users/:username/favorites', async (req, res) => {
    const { username } = req.params;
    const { albumId, albumName, albumCoverArt } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoriteAlbums.push({ albumId, albumName, albumCoverArt });
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = new User({ username, password, email });

    try {
     
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.get('/users/:username/favoriteAlbums', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.favoriteAlbums);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

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
            cover_art: album.images[0].url,
            album_type: album.album_type // Add this line

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
          cover_art: track.track.album.images[0].url,
      }));
      res.send(formattedData);
  })
  .catch(error => {
      res.status(500).send(error.toString());
  });
});

app.get('/albums/:id/tracks', async (req, res) => {
  const accessToken = await getValidToken();
  const albumId = req.params.id;

  axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then(response => {
      const trackData = response.data.items;
      const formattedData = trackData.map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map(artist => artist.name),
      }));
      res.json(formattedData);
  })
  .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching track data.' });
  });
});

app.get('/artist-albums', async (req, res) => {
  const accessToken = await getValidToken();
  const artistId = '5K4W6rqBFWDnAN6FQUkS6x'; // Kanye West's Spotify Artist ID

  axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
      headers: {
          'Authorization': `Bearer ${accessToken}`
      },
      params: {
          include_groups: 'album', // Only include albums (not singles, compilations, etc.)
          limit: 10 // Get up to 50 albums
      }
  })
  .then(response => {
      const albumsData = response.data.items;
      const formattedData = albumsData.map(album => ({
          id: album.id,
          name: album.name,
          artists: album.artists.map(artist => artist.name),
          release_date: album.release_date,
          cover_art: album.images[0].url,
          album_type: album.album_type
      }));
      res.send(formattedData);
  })
  .catch(error => {
      res.status(500).send(error.toString());
  });
});

app.get('/token', async (req, res) => {
  try {
    const token = await getValidToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.post('/party/:name/chat', async (req, res) => {
    try {
      const party = await Party.findOne({ name: req.params.name });
      if (!party) {
        return res.status(404).send();
      }
  
      // Find the user by username
      const user = await User.findOne({ username: req.body.user });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Push the new message into the chat array
      party.chat.push({
        user: req.body.user,
        message: req.body.message,
        timestamp: Date.now()
      });
  
      await party.save();
      res.status(201).send(party);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });

  app.get('/party/:name/chat', async (req, res) => {
    try {
      const party = await Party.findOne({ name: req.params.name });
      if (!party) {
        return res.status(404).send();
      }
      res.status(200).send(party.chat);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });

  const rapalbums = ['4eLPsYPBmXABThSJ821sqY', '5zi7WsKlIiUXv09tbGLKsE', 
  '42WVQWuf1teDysXiOupIZt', '4Q7cRXio6mF2ImVUCcezPO', '7dAm8ShwJLFm9SaJ6Yc58O', 
  '7IyoGB8J31fvQDwGtHAq9m', '2yXnY2NiaZk9QiJJittS81', '3bSNhnaQQXpC639OQ4pMyP',
'0UMMIkurRUmkruZ3KGBLtG', '2Ek1q2haOnxVqhvVKqMvJe']; 

app.get('/rapalbums', async (req, res) => {
    try {
      const accessToken = await getValidToken();
      const responses = await Promise.all(rapalbums.map(albumId => 
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
          id: albumData.id,
          album_type: albumData.album_type,
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

  const popalbums = ['1hmlhl74JfLyUqmqtCwvFb', '3q149oaxOiW9EoHXqM5nvO', 
  '2IUoE0jqkViW6gGfqLcjG2', '3KGVOGmIbinlrR97aFufGE', '5Csjy4XeA7KnizkhIvI7y2']; 

  app.get('/popalbums', async (req, res) => {
    try {
      const accessToken = await getValidToken();
      const responses = await Promise.all(popalbums.map(albumId => 
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
          id: albumData.id,
          album_type: albumData.album_type,
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

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));