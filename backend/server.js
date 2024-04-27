import express from 'express';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import cors from 'cors';
import Review from './models/Reviews.js';
import http from 'http';
import { Server } from 'socket.io';
import Party from './models/Parties.js';

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



const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));