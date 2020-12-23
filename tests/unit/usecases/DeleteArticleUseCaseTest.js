const assert = require('assert');
const sinon = require('sinon');

const DeleteArticleUseCase = require('../../../usecases/DeleteArticleUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');

describe('DeleteArticleUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let articleDao;
        let articleDaoStub = {};
        let deleteArticleUseCase;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            articleDao = new MongooseArticleDao();
            deleteArticleUseCase = new DeleteArticleUseCase(articleDao);
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            articleDaoStub.delete = sandbox.stub(articleDao, 'delete');
            articleDaoStub.create = sandbox.stub(articleDao, 'create');
            articleDaoStub.isInvalid = sandbox.stub(articleDao, 'isInvalid');
            articleDaoStub.isExist = sandbox.stub(articleDao, 'isExist');
        });

        afterEach(() => {
            articleDaoStub.delete.restore();
            articleDaoStub.create.restore();
            articleDaoStub.isInvalid.restore();
            articleDaoStub.isExist.restore();
        });

        it('should return TRUE when the title and author do exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};

            articleDaoStub.isInvalid.returns(false);
            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);

            articleDaoStub.delete.returns(true);
            assert.strictEqual(await deleteArticleUseCase.execute(articleObj.title, articleObj.authorname), true);
        });

        it('should return FALSE when the title and author do not exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};

            articleDaoStub.isInvalid.returns(false);
            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);

            articleDaoStub.delete.returns(false);
            assert.strictEqual(await deleteArticleUseCase.execute('New Title', articleObj.authorname), false);
            articleDaoStub.delete.returns(false);
            assert.strictEqual(await deleteArticleUseCase.execute(articleObj.title, 'jack'), false);
        });
    });
});