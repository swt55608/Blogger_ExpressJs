const assert = require('assert');

const GetAuthorArticlesUseCase = require('../../../usecases/GetAuthorArticlesUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');
const Utility = require('../../../entities/Utility');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));

describe('GetAuthorArticlesUseCase', () => {
    describe('#execute()', () => {
        let articleDao;
        let getAuthorArticlesUseCase, createArticleUseCase;

        beforeEach(async () => {
            ArticleModel.deleteMany();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
        });

        after(async () => {
            ArticleModel.deleteMany();
        });

        it('should return empty when there is no article', async () => {
            let expectedArticles = [];
            let actualArticles = await getAuthorArticlesUseCase.execute('mike');
            console.log(actualArticles);
            assert.deepStrictEqual(Utility.convertToJsonObject(actualArticles), Utility.convertToJsonObject(expectedArticles));
        });

        it('should return all articles of the author', async () => {
            let expectedArticles = [
                {title: 'apple', contents: 'aaaa', authorname: 'mike'},
                {title: 'banana', contents: 'bbbb', authorname: 'mike'}
            ];
 
            let isCreated = await createArticleUseCase.execute(expectedArticles[0]);
            assert.strictEqual(isCreated, true);
            isCreated = await createArticleUseCase.execute(expectedArticles[1]);
            assert.strictEqual(isCreated, true);

            let actualArticles = await getAuthorArticlesUseCase.execute('mike');
            assert.deepStrictEqual(Utility.convertToJsonObject(actualArticles), Utility.convertToJsonObject(expectedArticles));
        });
    });
});