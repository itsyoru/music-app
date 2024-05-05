import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chat: [{
        user: {
          type: String,
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
    videoQueue: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    }],

    currentTime: { // Add a currentTime field to store the current video's playback time
        type: Number,
        default: 0
    }
});

const Party = mongoose.model('Party', partySchema);

export default Party;