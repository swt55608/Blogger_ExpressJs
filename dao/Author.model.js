const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Author', authorSchema);