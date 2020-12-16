const assert = require('assert');

const CreateArticleUseCase = require('../../../usecases/CreateArticleUseCase');
const MongooseArticleDao = require('../../../dao/MongooseArticleDao');
const ArticleModel = require('../../../dao/Article.model');

describe('CreateArticleUseCase', () => {
    describe('#execute()', () => {
        let createArticleUseCase, articleDao;

        beforeEach(async () => {
            await ArticleModel.deleteMany();
            articleDao = new MongooseArticleDao();
            createArticleUseCase = new CreateArticleUseCase(articleDao);   
        });

        after(async () => {
            await ArticleModel.deleteMany();
        });

        it('should return TRUE when article has valid info', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
        });

        it('should return TRUE when article has valid info but contents is empty', async () => {
            let articleObj = {title: 'Have a nice day', contents: '', authorname: 'mike'};;
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
        });

        it('should return FALSE when article has invalid info', async () => {
            let articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};

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
            assert.strictEqual(await createArticleUseCase.execute(articleObj), true);
            
            articleObj = {title: 'Have a nice day', contents: 'Today is a great day, better than yesterday.', authorname: 'mike'};
            assert.strictEqual(await createArticleUseCase.execute(articleObj), false);
        });
    });
});