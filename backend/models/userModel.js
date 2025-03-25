const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
    firstName: { 
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },

    projectAccess:{
        type: String,
    },

    message: {
        type: String,
    }


    },
    { timestamps: true }

);

module.exports = mongoose.model('User', userSchema);