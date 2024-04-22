import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    spotifyID: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reviewedDate: {
        type: Date,
        default: Date.now
    },

    albumName: { // new field for album name
        type: String,
        required: true
    },
    albumCoverArt: { // new field for album cover art
        type: String,
        required: true
    },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;