const assert = require('assert');
const sinon = require('sinon');

const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const RegisterUseCase = require('../../../usecases/RegisterUseCase');

describe('RegisterUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let registerUseCase, authorDao;
        let authorDaoRegisterStub;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            authorDao = new MongooseAuthorDao();
            registerUseCase = new RegisterUseCase(authorDao);
            authorDaoRegisterStub = sandbox.stub(authorDao, 'register');
        });

        afterEach(() => {
            authorDaoRegisterStub.restore();
        });

        it('should return TRUE when author has valid account, password, and name', () => {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            let isRegistered = registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);
        });

        it('should return FALSE when author has invalid account', () => {
            assertAuthorWithInvalid("account");
        });

        it('should return FALSE when author has invalid password', () => {
            assertAuthorWithInvalid("password");
        });

        it('should return FALSE when author has invalid password', () => {
            assertAuthorWithInvalid("name");
        });

        function assertAuthorWithInvalid(key = '') {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};

            authorObj[key] = undefined;
            assert.strictEqual(registerUseCase.execute(authorObj), false);
            
            authorObj[key] = null;
            assert.strictEqual(registerUseCase.execute(authorObj), false);
        
            authorObj[key] = "";
            assert.strictEqual(registerUseCase.execute(authorObj), false);
        }
    });
});

