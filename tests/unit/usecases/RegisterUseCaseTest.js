const assert = require('assert');
const sinon = require('sinon');

const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const RegisterUseCase = require('../../../usecases/RegisterUseCase');

describe('RegisterUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let registerUseCase, authorDao;
        let authorDaoStubs = {};

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            authorDao = new MongooseAuthorDao();
            registerUseCase = new RegisterUseCase(authorDao);
            authorDaoStubs.register = sandbox.stub(authorDao, 'register');
            authorDaoStubs.isExist = sandbox.stub(authorDao, 'isExist');
        });

        afterEach(() => {
            authorDaoStubs.register.restore();
            authorDaoStubs.isExist.restore();
        });

        it('should return TRUE when author has valid account, password, and name', async () => {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            authorDaoStubs.register.returns(true);
            let isRegistered = await registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);
        });

        it('should return FALSE when the account has already existed', async () => {
            authorDaoStubs.isExist.returns(false);
            authorDaoStubs.register.returns(true); 
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            let isRegistered = await registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);

            authorDaoStubs.isExist.returns(true);
            authorDaoStubs.register.returns(false); 
            let anotherAuthorObj = {account: "mike", password: "mjmj", name: "Mike Johnson"};
            isRegistered = await registerUseCase.execute(anotherAuthorObj);
            assert.strictEqual(isRegistered, false);
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

        async function assertAuthorWithInvalid(key = '') {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            
            authorObj[key] = undefined;
            assert.strictEqual(await registerUseCase.execute(authorObj), false);
            
            authorObj[key] = null;
            assert.strictEqual(await registerUseCase.execute(authorObj), false);
        
            authorObj[key] = "";
            assert.strictEqual(await registerUseCase.execute(authorObj), false);
        }
    });
});

