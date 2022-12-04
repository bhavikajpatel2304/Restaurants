const mongoose = require('mongoose');

// Session Schema
const Session = new mongoose.Schema({

    is_active: {
        type: Boolean,
        default: true
    },
    
    session_id: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model('Session', Session);
