import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    explicit: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Track = mongoose.model('Track', trackSchema);

export default Track;