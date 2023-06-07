const mongoose  = require('mongoose');

const verifyusertokenSchema = new mongoose.Schema({
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
    
    token: {
        type: 'string',
        required: true,
    },  
    },  
    { timestamps : true }
);

let VerifyUserToken = mongoose.model('VerifyUserToken', verifyusertokenSchema);

module.exports = VerifyUserToken;