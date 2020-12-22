const assert = require('assert');
const { after } = require('mocha');

const ArticleModel = require('../../../dao/Article.model');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const Article = require('../../../entities/Article');
const {convertToJsonObject} = require('../../../entities/Utility');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));

describe('MongooseArticleDao', () => {
    let articleDao;

    beforeEach(async () => {
        await ArticleModel.deleteMany();
        articleDao = new MongooseArticleDao();
    })

    after(async () => {
        await ArticleModel.deleteMany();
    });

    describe('#isInvalid()', () => {
        it('should return TRUE when article title is undefined, null, or empty', () => {
            let article = new Article({title: undefined, contents: '', authorname: 'mike'});
            assert.strictEqual(articleDao.isInvalid(article), true);
            article.title = null;
            assert.strictEqual(articleDao.isInvalid(article), true);
            article.title = '';
            assert.strictEqual(articleDao.isInvalid(article), true);
        });

        it('should return TRUE when article contents is undefined, null', () => {
            let article = new Article({title: 'Have a nice day', contents: undefined, authorname: 'mike'});
            assert.strictEqual(articleDao.isInvalid(article), true);
            article.contents = null;
            assert.strictEqual(articleDao.isInvalid(article), true);
        });

        it('should return FALSE when article contents is empty', () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(articleDao.isInvalid(article), false);
        });

        it('should return TRUE when article authorname is undefined, null, or empty', () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: undefined});
            assert.strictEqual(articleDao.isInvalid(article), true);
            article.authorname = null;
            assert.strictEqual(articleDao.isInvalid(article), true);
            article.authorname = '';
            assert.strictEqual(articleDao.isInvalid(article), true);
        });
    });

    describe('#isExist()', () => {
        it('should return TRUE when article does already exist', async () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(article), true);
            assert.strictEqual(await articleDao.isExist(article), true);
        });

        it('should return FALSE when article does not exist', async () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.isExist(article), false);
        });
    });

    describe('#create()', () => {
        it('should return TRUE when article does not exist', async () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(article), true);
        });

        it('should return FALSE when article does already exist', async () => {
            let article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(article), true);

            article = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(article), false);
        });
    });

    describe('#findAll', () => {
        it('should return empty when no article exists', async () => {
            let expectedArticles = [];
            let actualArticles = await articleDao.findAll();
            assert.deepStrictEqual(convertToJsonObject(actualArticles), convertToJsonObject(expectedArticles));
        });

        it('should return all articles', async () => {
            let expectedArticles = [
                new Article({title: 'Have a nice day', contents: '', authorname: 'mike'}),
                new Article({title: 'Mike loves heathly food!!!', contents: 'Fried Chicken are tasty, but vegetable is better.', authorname: 'mike'}),
                new Article({title: 'Jack is looking for FUN', contents: '...', authorname: 'jack'})
            ];

            assert.strictEqual(await articleDao.create(expectedArticles[0]), true);
            assert.strictEqual(await articleDao.create(expectedArticles[1]), true);
            assert.strictEqual(await articleDao.create(expectedArticles[2]), true);

            let actualArticles = await articleDao.findAll();
            assert.deepStrictEqual(convertToJsonObject(actualArticles), convertToJsonObject(expectedArticles));
        });
    });

    describe('#findByAuthorName', () => {
        it('should return empty when no article exists', async () => {
            let expectedArticles = [];
            let actualArticles = await articleDao.findAll();
            assert.deepStrictEqual(convertToJsonObject(actualArticles), convertToJsonObject(expectedArticles));
        });

        it('should return all articles of the author', async () => {
            let expectedArticles = [
                new Article({title: 'Have a nice day', contents: '', authorname: 'mike'}),
                new Article({title: 'Mike loves heathly food!!!', contents: 'Fried Chicken are tasty, but vegetable is better.', authorname: 'mike'})
            ];

            assert.strictEqual(await articleDao.create(expectedArticles[0]), true);
            assert.strictEqual(await articleDao.create(expectedArticles[1]), true);

            let actualArticles = await articleDao.findByAuthorName('mike');
            assert.deepStrictEqual(convertToJsonObject(actualArticles), convertToJsonObject(expectedArticles));
        });
    });
});