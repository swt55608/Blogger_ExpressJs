const express = require('express');

const RegisterUseCase = require('../usecases/RegisterUseCase');
const LoginUseCase = require('../usecases/LoginUseCase');
const MongooseAuthorDao = require('../dao/MongooseAuthorDao');

const router = express.Router();

router.post('/register/authors', async (req, res) => {
    let requestScope = res.locals.requestScope;
    let reqBody = req.body;
    let statusCode = 500;
    if (reqBody) {
        let authorObj = {
            account: reqBody.account, 
            password: reqBody.password, 
            name: reqBody.name
        };
        let isRegistered = await new RegisterUseCase(new MongooseAuthorDao()).execute(authorObj);
        if (isRegistered) {
            statusCode = 201;
            req.session.account = authorObj.account;
        } else {
            statusCode = 401;
            requestScope.errorMessage = 'Incorrect Registration Info or Has Already Registered';
        }
    } else {
        statusCode = 500;
        requestScope.errorMessage = 'Wrong in reqBody';
    }
    res.status(statusCode).render('index');
});

router.post('/login/authors', async (req, res) => {
    let requestScope = res.locals.requestScope;
    let reqBody = req.body;
    let statusCode = 500;
    if (reqBody) {
        let authorObj = {
            account: reqBody.account,
            password: reqBody.password
        };
        let isLogin = await new LoginUseCase(new MongooseAuthorDao()).execute(authorObj);
        if (isLogin) {
            statusCode = 200;
            req.session.account = authorObj.account;
        } else {
            statusCode = 401;
            requestScope.errorMessage = 'Incorrect account or password';
        }
    } else {
        statusCode = 500;
        requestScope.errorMessage = 'Wrong in reqBody';
    }
    res.status(statusCode).render('index');
});

router.get('/logout/authors', (req, res) => {
    res.locals.sessionScope = {};
    req.session.destroy();
    res.status(200).render('index');
});

module.exports = router;