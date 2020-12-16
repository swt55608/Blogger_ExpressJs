const assert = require('assert');
const sinon = require('sinon');

const GetAllArticlesUseCase = require('../../../usecases/GetAllArticlesUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');

describe('GetAllArticlesUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let articleDaoStub = {};
        let createArticleUseCaseStub = {};
        let createArticleUseCase, getAllArticlesUseCase;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            let articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            getAllArticlesUseCase = new GetAllArticlesUseCase(articleDao);
            createArticleUseCaseStub.execute = sandbox.stub(createArticleUseCase, 'execute');
            articleDaoStub.findAll = sandbox.stub(articleDao, 'findAll');
        });

        afterEach(() => {
            articleDaoStub.findAll.restore();
            createArticleUseCaseStub.execute.restore();
        });

        it('should return empty when there is no article', async () => {
            let expectedArticles = [];
            articleDaoStub.findAll.returns(expectedArticles);
            let actualArticles = await getAllArticlesUseCase.execute();
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });

        it('should return all articles', async () => {
            let expectedArticles = [
                {title: 'apple', contents: 'aaaa', authorname: 'mike'},
                {title: 'banana', contents: 'bbbb', authorname: 'mike'}
            ];
 
            createArticleUseCaseStub.execute.returns(true);
            let isCreated = await createArticleUseCase.execute(expectedArticles[0]);
            assert.strictEqual(isCreated, true);
            isCreated = await createArticleUseCase.execute(expectedArticles[1]);
            assert.strictEqual(isCreated, true);

            articleDaoStub.findAll.returns(expectedArticles);
            let actualArticles = await getAllArticlesUseCase.execute();
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });
    });
});