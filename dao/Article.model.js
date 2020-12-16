const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String
    },
    authorname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Article', articleSchema);