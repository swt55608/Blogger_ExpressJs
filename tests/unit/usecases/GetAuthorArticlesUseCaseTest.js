const assert = require('assert');
const sinon = require('sinon');

const GetAuthorArticlesUseCase = require('../../../usecases/GetAuthorArticlesUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const Article = require('../../../entities/Article');

describe('GetAuthorArticlesUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let articleDao;
        let articleDaoStub = {}, createArticleUseCaseStub = {};
        let getAuthorArticlesUseCase, createArticleUseCase;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
            createArticleUseCaseStub.execute = sandbox.stub(createArticleUseCase, 'execute');
            articleDaoStub.findByAuthorName = sandbox.stub(articleDao, 'findByAuthorName');
        });

        afterEach(() => {
            articleDaoStub.findByAuthorName.restore();
            createArticleUseCaseStub.execute.restore();
        });

        it('should return empty when there is no article', async () => {
            let expectedArticles = [];
            articleDaoStub.findByAuthorName.returns(expectedArticles);
            let actualArticles = await getAuthorArticlesUseCase.execute('mike');
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });

        it('should return all articles of the author', async () => {
            let expectedArticles = [
                {title: 'apple', contents: 'aaaa', authorname: 'mike'},
                {title: 'banana', contents: 'bbbb', authorname: 'mike'}
            ];
 
            createArticleUseCaseStub.execute.returns(true);
            let isCreated = await createArticleUseCase.execute(expectedArticles[0]);
            assert.strictEqual(isCreated, true);
            isCreated = await createArticleUseCase.execute(expectedArticles[1]);
            assert.strictEqual(isCreated, true);

            let daoResult = [];
            for (let articleObj of expectedArticles) {
                daoResult.push(new Article({
                    title: articleObj.title,
                    contents: articleObj.contents,
                    authorname: articleObj.authorname
                }));
            }
            articleDaoStub.findByAuthorName.returns(daoResult);
            let actualArticles = await getAuthorArticlesUseCase.execute('mike');
            assert.deepStrictEqual(actualArticles, expectedArticles);
        });
    });
});