const assert = require('assert');

const GetAuthorArticlesUseCase = require('../../../usecases/GetAuthorArticlesUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');

describe('GetAuthorArticlesUseCase', () => {
    describe('#execute()', () => {
        let articleDao;
        let getAuthorArticlesUseCase, createArticleUseCase;

        beforeEach(async () => {
            await ArticleModel.deleteMany();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
        });

        it('should return empty when there is no article', async () => {
            let expectedArticles = [];
            let actualArticles = await getAuthorArticlesUseCase.execute('mike');
            assert.deepStrictEqual(actualArticles, expectedArticles);
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
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });
    });
});