const express = require('express');

const RegisterUseCase = require('../usecases/RegisterUseCase');
const LoginUseCase = require('../usecases/LoginUseCase');
const MongooseAuthorDao = require('../dao/MongooseAuthorDao');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));

const router = express.Router();

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
    // res.status(statusCode).json({msg: msg});
    res.status(statusCode).render('index', {data: {account: req.session.author}});
});

router.post('/login/authors', async (req, res) => {
    let statusCode, msg;
    if (req.body) {
        let {account, password} = req.body;
        let authorObj = {account: account, password: password};
        let isLogin = await new LoginUseCase(new MongooseAuthorDao()).execute(authorObj);
        req.session.author = isLogin ? authorObj.account : null;
        statusCode = isLogin ? 200 : 401;
        msg = isLogin ? 'Login success' : 'Login failure';
    } else {
        statusCode = 500;
        msg = 'Wrong in reqBody';
    }
    // res.status(statusCode).json({msg: msg});
    res.status(statusCode).render('index', {data: {account: req.session.author}});
});

router.post('/logout/authors', (req, res) => {
    req.session.destroy();
    // res.status(200).json({msg: 'Logout success'});
    res.status(200).render('index', {data: {}});
});

module.exports = router;