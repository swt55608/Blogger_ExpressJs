const assert = require('assert');

const AuthorModel = require('../../../dao/Author.model');
const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const RegisterUseCase = require('../../../usecases/RegisterUseCase');

describe('RegisterUseCase', () => {
    describe('#execute()', () => {
        let registerUseCase;

        beforeEach(async () => {
            await AuthorModel.deleteMany();
            let authorDao = new MongooseAuthorDao();
            registerUseCase = new RegisterUseCase(authorDao);
        });

        it('should return TRUE when author has valid account, password, and name', async () => {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            let isRegistered = await registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);
        });

        it('should return FALSE when the account has already existed', async () => {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            let isRegistered = await registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);

            let anotherAuthorObj = {account: "mike", password: "mjmj", name: "Mike Johnson"};
            isRegistered = await registerUseCase.execute(anotherAuthorObj);
            assert.strictEqual(isRegistered, false);
        });

        it('should return FALSE when the name has already existed', async () => {
            let authorObj = {account: "mike", password: "mmm", name: "Mike Mouse"};
            let isRegistered = await registerUseCase.execute(authorObj);
            assert.strictEqual(isRegistered, true);

            let anotherAuthorObj = {account: "jack", password: "jjj", name: "Mike Mouse"};
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

