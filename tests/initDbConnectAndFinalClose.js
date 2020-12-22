const mongoose = require('mongoose');

const AuthorModel = require('../dao/Author.model');
const ArticleModel = require('../dao/Article.model');

mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));
db.on('close', () => console.log('Close Connection to MongoDB'));

after(async () => {
    await AuthorModel.deleteMany();
    await ArticleModel.deleteMany();
    db.close();
});