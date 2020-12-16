const assert = require('assert');
const sinon = require('sinon');

const AuthorModel = require('../../../dao/Author.model');
const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const RegisterUseCase = require('../../../usecases/RegisterUseCase');
const LoginUseCase = require('../../../usecases/LoginUseCase');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));
db.on('close', () => console.log('Closed Connection to MongoDB'));

describe('LoginUseCase', () => {
    describe('#execute()', () => {
        let loginUseCase;

        beforeEach(async () => {
            await AuthorModel.deleteMany();
            let authorDao = new MongooseAuthorDao();
            let registerUseCase = new RegisterUseCase(authorDao);
            await registerUseCase.execute({account: "mike", password: "mmm", name: "Mike Mouse"});
            loginUseCase = new LoginUseCase(authorDao);
        });

        after(async () => {
            await AuthorModel.deleteMany();
        });

        it('should return TRUE when account and password are both correct', async () => {
            let loginInfo = {account: "mike", password: "mmm"};
            assert.strictEqual(await loginUseCase.execute(loginInfo), true);
        });

        it('should return FALSE when account is invalid or does not exist', async () => {
            let loginInfo = {account: undefined, password: "mmm"};
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["account"] = null;
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["account"] = '';
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["account"] = "jack";
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
        });

        it('should return FALSE when password is invalid or incorrect', async () => {
            let loginInfo = {account: "mike", password: undefined};
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["password"] = null;
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["password"] = '';
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
            loginInfo["password"] = "jjj";
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
        });
    });
});