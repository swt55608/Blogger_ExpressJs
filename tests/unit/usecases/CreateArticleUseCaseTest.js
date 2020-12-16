const assert = require('assert');
const sinon = require('sinon');

const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');

describe('CreateArticleUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let articleDaoStubs = {};
        let createArticleUseCase, articleDao;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            articleDaoStubs.create = sandbox.stub(articleDao, 'create');
            articleDaoStubs.isInvalid = sandbox.stub(articleDao, 'isInvalid');
            articleDaoStubs.isExist = sandbox.stub(articleDao, 'isExist');
        });

        afterEach(() => {
            articleDaoStubs.create.restore();
            articleDaoStubs.isInvalid.restore();
            articleDaoStubs.isExist.restore();
        });

        it('should return TRUE when article has valid info', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            articleDaoStubs.isInvalid.returns(false);
            articleDaoStubs.isExist.returns(false);
            articleDaoStubs.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
        });

        it('should return TRUE when article has valid info but contents is empty', async () => {
            let articleObj = {title: 'Have a nice day', contents: '', authorname: 'mike'};
            articleDaoStubs.isInvalid.returns(false);
            articleDaoStubs.isExist.returns(false);
            articleDaoStubs.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
        });

        it('should return FALSE when article has invalid info', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};

            articleDaoStubs.isInvalid.returns(true);
            for (let key in articleObj) {
                articleObj[key] = undefined;
                assert.strictEqual(await createArticleUseCase.execute(articleObj), false);
    
                articleObj[key] = null;
                assert.strictEqual(await createArticleUseCase.execute(articleObj), false);
    
                articleObj[key] = '';
                assert.strictEqual(await createArticleUseCase.execute(articleObj), false);
            }
        });

        it('should return FALSE when article title already exists', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            articleDaoStubs.isInvalid.returns(false);
            articleDaoStubs.isExist.returns(false);
            articleDaoStubs.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
            
            articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            articleDaoStubs.isInvalid.returns(false);
            articleDaoStubs.isExist.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), false);
        });
    });
});