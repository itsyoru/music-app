import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    tracklist: {
        type: [String],
        required: true
    },
    explicit: {
        type: Boolean,
        required: true
    }
});

const Album = mongoose.model('Album', albumSchema);

export default Album;