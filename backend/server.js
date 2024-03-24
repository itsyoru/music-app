import express from 'express';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import cors from 'cors';

const app = express();
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://fkhan27:r2BPsC9bt8K49GE8@sysdesign.alwougr.mongodb.net/den?retryWrites=true&w=majority&appName=sysdesign', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Database connection error: ' + err));

// ... other routes here ...

app.post('/register', (req, res) => {
    console.log('Request body:', req.body); // Log the request body

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        createdAccountDate: req.body.createdAccountDate || Date.now(),
        // ... other properties here ...
    });

    newUser.save()
        .then(savedUser => {
            console.log('User saved:', savedUser);
            res.json('User registered!');
        })
        .catch(err => {
            console.log('Error:', err); // Log the error message
            res.status(400).json('Error: ' + err);
        });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));