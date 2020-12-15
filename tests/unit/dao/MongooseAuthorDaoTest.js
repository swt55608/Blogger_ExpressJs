const assert = require('assert');
const mongoose = require('mongoose');

const AuthorModel = require('../../../dao/Author.model');
const MongooseAuthorDao = require('../../../dao/MongooseAuthorDao');
const Author = require('../../../entities/Author');

mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', err => console.error(err));
db.on('open', () => console.log('Connection to MongoDB'));

describe('MongooseAuthorDao', () => {
    describe("#register()", () => {
        let authorDao;
        
        beforeEach(async () => {
            await AuthorModel.deleteMany();
            authorDao = new MongooseAuthorDao();
        });

        after(async () => {
            await AuthorModel.deleteMany();
        });

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
});