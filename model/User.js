const mongoose = require('mongoose');

// User Schema
const User = new mongoose.Schema({

    name: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model('User', User);
