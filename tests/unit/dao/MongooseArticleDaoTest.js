const assert = require('assert');
const { after } = require('mocha');

const ArticleModel = require('../../../dao/Article.model');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const Article = require('../../../entities/Article');
const Utility = require('../../../entities/Utility');

describe('MongooseArticleDao', () => {
    let articleDao;

    beforeEach(async () => {
        await ArticleModel.deleteMany();
        articleDao = new MongooseArticleDao();
    })

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

    describe('#findAll()', () => {
        it('should return empty when no article exists', async () => {
            let expectedArticles = [];
            let actualArticles = await articleDao.findAll();
            assert.deepStrictEqual(Utility.convertCustomArrayToJsonObject(actualArticles), Utility.convertCustomArrayToJsonObject(expectedArticles));
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
            assert.deepStrictEqual(Utility.convertCustomArrayToJsonObject(actualArticles), Utility.convertCustomArrayToJsonObject(expectedArticles));
        });
    });

    describe('#findByAuthorName()', () => {
        it('should return empty when no article exists', async () => {
            let expectedArticles = [];
            let actualArticles = await articleDao.findAll();
            assert.deepStrictEqual(Utility.convertCustomArrayToJsonObject(actualArticles), Utility.convertCustomArrayToJsonObject(expectedArticles));
        });

        it('should return all articles of the author', async () => {
            let expectedArticles = [
                new Article({title: 'Have a nice day', contents: '', authorname: 'mike'}),
                new Article({title: 'Mike loves heathly food!!!', contents: 'Fried Chicken are tasty, but vegetable is better.', authorname: 'mike'})
            ];

            assert.strictEqual(await articleDao.create(expectedArticles[0]), true);
            assert.strictEqual(await articleDao.create(expectedArticles[1]), true);

            let actualArticles = await articleDao.findByAuthorName('mike');
            assert.deepStrictEqual(Utility.convertCustomArrayToJsonObject(actualArticles), Utility.convertCustomArrayToJsonObject(expectedArticles));
        });
    });

    describe('#findByTitleAndAuthorname()', async () => {
        it('should return the article when match title and authorname', async () => {
            let expectedArticleObj = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(expectedArticleObj), true);
            let actualArticleObj = await articleDao.findByTitleAndAuthorname(expectedArticleObj.title, expectedArticleObj.authorname);
            assert.deepStrictEqual(Utility.convertToJsonObject(actualArticleObj), Utility.convertToJsonObject(expectedArticleObj));
        });

        it('should return NULL when not match title and authorname', async () => {
            let expectedArticleObj = new Article({title: 'Have a nice day', contents: '', authorname: 'mike'});
            assert.strictEqual(await articleDao.create(expectedArticleObj), true);
            let actualArticleObj = await articleDao.findByTitleAndAuthorname(expectedArticleObj.title, 'jack');
            assert.deepStrictEqual(actualArticleObj, null);
        });
    });

    describe('#update()', () => {
        it('should return TRUE when successfully edit article title', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: 'Very Happy Day', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), true);
        });

        it('should return TRUE when successfully edit article contents', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'Something good would happen...', authorname: oriArticleInfo.authorname};
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), true);
        });

        it('should return FALSE when there\'s no changes', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = oriArticleInfo;
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), false);
        });

        it('should return FALSE when new title is undefined, null, or empty', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: undefined, contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), false);

            newArticleInfo.title = null;
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), false);

            newArticleInfo.title = '';
            assert.strictEqual(await articleDao.update(new Article(oriArticleInfo), new Article(newArticleInfo)), false);
        });

        it('should return FALSE when original title does not exist', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let wrongTitleArticleInfo = {title: 'New', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'New Contents', authorname: oriArticleInfo.authorname};
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(wrongTitleArticleInfo), new Article(newArticleInfo)), false);
        });

        it('should return FALSE when author is not the article author', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let wrongAuthorMatchArticleInfo = {title: oriArticleInfo.title, contents: oriArticleInfo.contents, authorname: 'jack'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'New Contents', authorname: oriArticleInfo.authorname};
            assert.strictEqual(await articleDao.create(new Article(oriArticleInfo)), true);
            assert.strictEqual(await articleDao.update(new Article(wrongAuthorMatchArticleInfo), new Article(newArticleInfo)), false);
        });
    });

    describe('#delete()', () => {
        it('should return TRUE when the title and author do exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await articleDao.create(new Article(articleObj)), true);
            assert.strictEqual(await articleDao.delete(articleObj.title, articleObj.authorname), true);
        });

        it('should return FALSE when the title and author do not exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await articleDao.create(new Article(articleObj)), true);
            assert.strictEqual(await articleDao.delete('New Title', articleObj.authorname), false);
            assert.strictEqual(await articleDao.delete(articleObj.title, 'jack'), false);
        });
    });
});