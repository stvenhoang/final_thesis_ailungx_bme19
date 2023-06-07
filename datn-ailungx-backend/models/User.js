const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        minleght: 6,
        maxlenght: 20,
        unique: true
    },
    email: {
        type: 'string',
        required: true,
        minleght: 6,
        maxlenght: 50,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        minleght: 6,
    },
    vipmember: {
        type: Boolean,
        default: false,
    },
    numpredict: {
        type: Number,
        default: 1,
    },

    images: {
        type: Array,
        default: [],
    },
    
    },  
    { timestamps : true }
);

let User = mongoose.model('User', userSchema);

module.exports = User;