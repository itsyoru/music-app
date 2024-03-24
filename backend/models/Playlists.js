import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    tracklist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;