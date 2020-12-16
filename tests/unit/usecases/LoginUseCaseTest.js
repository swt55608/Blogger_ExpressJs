const assert = require('assert');
const sinon = require('sinon');

const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const RegisterUseCase = require('../../../usecases/RegisterUseCase');
const LoginUseCase = require('../../../usecases/LoginUseCase');

describe('LoginUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let loginUseCase;
        let authorDaoStubs = {};

        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            
            let authorDao = new MongooseAuthorDao();
            let registerUseCase = new RegisterUseCase(authorDao);
            await registerUseCase.execute({account: "mike", password: "mmm", name: "Mike Mouse"});
            
            loginUseCase = new LoginUseCase(authorDao);
            authorDaoStubs.login = sandbox.stub(authorDao, 'login');
        });

        afterEach(() => {
            authorDaoStubs.login.restore();
        });

        it('should return TRUE when account and password are both correct', async () => {
            let loginInfo = {account: "mike", password: "mmm"};
            authorDaoStubs.login.returns(true);
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
            authorDaoStubs.login.returns(false);
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
            authorDaoStubs.login.returns(false);
            assert.strictEqual(await loginUseCase.execute(loginInfo), false);
        });
    });
});