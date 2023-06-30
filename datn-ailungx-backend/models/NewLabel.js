const mongoose  = require('mongoose');

const newlabelSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    image: {
        type: 'string',
        required: true,
    },
    
    label: {
        type: 'string',
        required: true,
    },  
    },  
    { timestamps : true }
);

let NewLabel = mongoose.model('NewLabel', newlabelSchema);

module.exports = NewLabel;