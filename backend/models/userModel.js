import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    avatar: {
        type: String,
    },

    bio: {
        type: String,
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    favoriteAlbums: [{
        albumId: String,
        albumName: String,
        albumCoverArt: String
    }],

    createdAccountDate: {
        type: Date,
        default: Date.now,
    }

});

    const User = mongoose.model('User', userSchema);

    export default User;