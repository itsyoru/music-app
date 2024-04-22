import express from 'express';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import cors from 'cors';
import Review from './models/Reviews.js';

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

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));