const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type:String,
        required: true,
        trim: true
    },
    date:{
        type:String,
        required:true,
    },
    createdBy:{
        type: ObjectId,
        required: true,
        ref:'User'
    },
    invitees:{
        type:[{invitee: user}],
        required: true
        
    }
},
    { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);