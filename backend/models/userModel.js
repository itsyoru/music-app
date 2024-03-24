import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
    }],

    createdAccountDate: {
        type: Date,
        default: Date.now,
    }

});

    const User = mongoose.model('User', userSchema);

    export default User;