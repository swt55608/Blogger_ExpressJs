const assert = require('assert');

const GetAllArticlesUseCase = require('../../../usecases/GetAllArticlesUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');

describe('GetAllArticlesUseCase', () => {
    describe('#execute()', () => {
        let createArticleUseCase, getAllArticlesUseCase;

        beforeEach(async () => {
            await ArticleModel.deleteMany();
            let articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            getAllArticlesUseCase = new GetAllArticlesUseCase(articleDao);
        });

        it('should return empty when there is no article', async () => {
            let expectedArticles = [];
            let actualArticles = await getAllArticlesUseCase.execute();
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });

        it('should return all articles', async () => {
            let expectedArticles = [
                {title: 'apple', contents: 'aaaa', authorname: 'mike123'},
                {title: 'banana', contents: 'bbbb', authorname: 'mike'}
            ];
 
            let isCreated = await createArticleUseCase.execute(expectedArticles[0]);
            assert.strictEqual(isCreated, true);
            isCreated = await createArticleUseCase.execute(expectedArticles[1]);
            assert.strictEqual(isCreated, true);
            
            let actualArticles = await getAllArticlesUseCase.execute();
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });
    });
});