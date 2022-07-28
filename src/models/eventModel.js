const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: [String],
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    invitees: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        invitedAt: Date.now(),
        required: true
    }
},
    { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);