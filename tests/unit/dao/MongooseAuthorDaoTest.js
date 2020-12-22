const assert = require('assert');

const AuthorModel = require('../../../dao/Author.model');
const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const Author = require('../../../entities/Author');

describe('MongooseAuthorDao', () => {
    let authorDao;

    beforeEach(async () => {
        await AuthorModel.deleteMany();
        authorDao = new MongooseAuthorDao();
    });

    describe("#register()", () => {
        it('should return TRUE when correct account, password, and name', async () => {
            let author = new Author({account: "mike", password: "mmm", name: "Mike Mouse"});
            assert.strictEqual(await authorDao.register(author), true);
        });

        it('should return FALSE when the account is alreay registered', async () => {
            let author = new Author({account: "mike", password: "mmm", name: "Mike Mouse"});
            assert.strictEqual(await authorDao.register(author), true);
            assert.strictEqual(await authorDao.register(author), false);
        });

        it('should return FALSE when author has invalid account', () => {
            assertAuthorWithInvalid('account');
        });

        it('should return FALSE when author has invalid password', () => {
            assertAuthorWithInvalid('password');
        });

        it('should return FALSE when author has invalid name', () => {
            assertAuthorWithInvalid('name');
        });

        async function assertAuthorWithInvalid(key = '') {
            let author = new Author({account: 'mike', password: "mmm", name: "Mike Mouse"});

            author[key] = undefined;
            assert.strictEqual(await authorDao.register(author), false);
            author[key] = null;
            assert.strictEqual(await authorDao.register(author), false);
            author[key] = "";
            assert.strictEqual(await authorDao.register(author), false);
        }
    });

    describe('#login()', () => {
        it('should return TRUE when account and password are both correct', async () => {
            let author = new Author({account: "mike", password: "mmm", name: "Mike Mouse"});
            assert.strictEqual(await authorDao.register(author), true);
            assert.strictEqual(await authorDao.login(author), true);
        });

        it('should return FALSE when account is invalid or does not exist', async () => {
            let author = new Author({account: "mike", password: "mmm", name: "Mike Mouse"});
            assert.strictEqual(await authorDao.login(author), false);
        });

        it('should return FALSE when password is invalid or incorrect', async () => {
            let author = new Author({account: "mike", password: "mmm", name: "Mike Mouse"});
            assert.strictEqual(await authorDao.register(author), true);

            author.password = undefined;
            assert.strictEqual(await authorDao.login(author), false);

            author.password = null;
            assert.strictEqual(await authorDao.login(author), false);

            author.password = '';
            assert.strictEqual(await authorDao.login(author), false);

            author.password = 'notasecret';
            assert.strictEqual(await authorDao.login(author), false);
        });
    });
});