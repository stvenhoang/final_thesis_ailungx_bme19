const mongoose  = require('mongoose');

const rftokenSchema = new mongoose.Schema({
    refreshToken: {
        type: 'string',
        required: true,
        unique: true
    },
    accessToken: {
        type: 'string',
        required: true,
        unique: true
    },  
    },  
    { timestamps : true }
);

let Rftoken = mongoose.model('Rftoken', rftokenSchema);

module.exports = Rftoken;