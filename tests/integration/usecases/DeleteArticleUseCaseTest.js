const assert = require('assert');

const DeleteArticleUseCase = require('../../../usecases/DeleteArticleUseCase');
const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');

describe('DeleteArticleUseCase', () => {
    describe('#execute()', () => {
        let articleDao;
        let deleteArticleUseCase;

        beforeEach(async () => {
            await ArticleModel.deleteMany();
            articleDao = new MongooseArticleDao();
            deleteArticleUseCase = new DeleteArticleUseCase(articleDao);
            createArticleUseCase = new CreateArticleUseCase(articleDao);
        });

        it('should return TRUE when the title and author do exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
            assert.strictEqual(await deleteArticleUseCase.execute(articleObj.title, articleObj.authorname), true);
        });

        it('should return FALSE when the title and author do not exist', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
            assert.strictEqual(await deleteArticleUseCase.execute('New Title', articleObj.authorname), false);
            assert.strictEqual(await deleteArticleUseCase.execute(articleObj.title, 'jack'), false);
        });
    });
});