const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    year: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('User', UserSchema);
