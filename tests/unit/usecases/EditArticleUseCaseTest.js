const assert = require('assert');
const sinon = require('sinon');

const EditArticleUseCase = require('../../../usecases/EditArticleUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');

describe('EditArticleUseCase', () => {
    describe('#execute()', () => {
        let sandbox;
        let articleDao;
        let articleDaoStub = {};
        let editArticleUseCase, createArticleUseCase;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            editArticleUseCase = new EditArticleUseCase(articleDao);
            articleDaoStub.update = sandbox.stub(articleDao, 'update');
            articleDaoStub.isExist = sandbox.stub(articleDao, 'isExist');
            articleDaoStub.create = sandbox.stub(articleDao, 'create');
        });

        afterEach(() => {
            articleDaoStub.update.restore();
        });

        it('should return TRUE when successfully edit article title', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: 'Very Happy Day', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            

            articleDaoStub.update.returns(true);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), true);
        });

        it('should return TRUE when successfully edit article contents', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'Something good would happen...', authorname: oriArticleInfo.authorname};

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            

            articleDaoStub.update.returns(true);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), true);
        });

        it('should return FALSE when there\'s no changes', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = oriArticleInfo;

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            

            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when new title is undefined, null, or empty', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: undefined, contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);

            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);

            newArticleInfo.title = null;
            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);

            newArticleInfo.title = '';
            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when original title does not exist', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let wrongTitleArticleInfo = {title: 'New', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'New Contents', authorname: oriArticleInfo.authorname};

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);

            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(wrongTitleArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when author is not the article author', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: oriArticleInfo.contents, authorname: 'jack'};

            articleDaoStub.isExist.returns(false);
            articleDaoStub.create.returns(true);
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);

            articleDaoStub.update.returns(false);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });
    });
});