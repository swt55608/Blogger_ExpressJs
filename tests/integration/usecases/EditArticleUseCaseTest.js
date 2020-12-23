const assert = require('assert');

const EditArticleUseCase = require('../../../usecases/EditArticleUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');

describe('EditArticleUseCase', () => {
    describe('#execute()', () => {
        let articleDao;
        let editArticleUseCase, createArticleUseCase;

        beforeEach(async () => {
            await ArticleModel.deleteMany();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);
            editArticleUseCase = new EditArticleUseCase(articleDao);
        });

        it('should return TRUE when successfully edit article title', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: 'Very Happy Day', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), true);
        });

        it('should return TRUE when successfully edit article contents', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'Something good would happen...', authorname: oriArticleInfo.authorname};
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), true);
        });

        it('should return FALSE when there\'s no changes', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = oriArticleInfo;
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);            
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when new title is undefined, null, or empty', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: undefined, contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};

            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);

            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);

            newArticleInfo.title = null;
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);

            newArticleInfo.title = '';
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when original title does not exist', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let wrongTitleArticleInfo = {title: 'New', contents: oriArticleInfo.contents, authorname: oriArticleInfo.authorname};
            let newArticleInfo = {title: oriArticleInfo.title, contents: 'New Contents', authorname: oriArticleInfo.authorname};
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);
            assert.strictEqual(await editArticleUseCase.execute(wrongTitleArticleInfo, newArticleInfo), false);
        });

        it('should return FALSE when author is not the article author', async () => {
            let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
            let newArticleInfo = {title: oriArticleInfo.title, contents: oriArticleInfo.contents, authorname: 'jack'};
            assert.strictEqual(await createArticleUseCase.execute(oriArticleInfo), true);
            assert.strictEqual(await editArticleUseCase.execute(oriArticleInfo, newArticleInfo), false);
        });
    });
});