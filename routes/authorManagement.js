const express = require('express');
const router = express.Router();

const RegisterUseCase = require('../usecases/RegisterUseCase');
const MongooseAuthorDao = require('../dao/MongooseAuthorDao');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));

router.post('/register/authors', async (req, res) => {
    let statusCode, msg;
    if (req.body) {
        let {account, password, name} = req.body;
        let authorObj = {account: account, password: password, name: name};
        let isRegistered = await new RegisterUseCase(new MongooseAuthorDao()).execute(authorObj);
        req.session.author = isRegistered ? authorObj.account : null;
        statusCode = isRegistered ? 201 : 401;
        msg = isRegistered ? 'Registeration success' : 'Registeration failure';
    } else {
        statusCode = 500;
        msg = 'Wrong in reqBody';
    }
    res.status(statusCode).json({msg: msg});
});

// router.post('/login/authors', (req, res) => {

// });

// router.post('/logout/authors', (req, res) => {

// });

module.exports = router;