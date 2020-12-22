const MongooseArticleDao = require('../dao/MongooseArticleDao');
const Article = require('../entities/Article');

class CreateArticleUseCase {
    constructor(articleDao) {
        if (articleDao === undefined) {
            this.articleDao = new MongooseArticleDao();
        } else {
            this.articleDao = articleDao;
        }
    }
    
    async execute(articleObj = {title: '', contents: '', authorname: ''}) {
        let article = new Article(articleObj);
        if (this.articleDao.isInvalid(article)) {
            return false;
        } else if (await this.articleDao.isExist(article)) {
            return false;
        } else {
            return this.articleDao.create(article);
        }
    }
}

module.exports = CreateArticleUseCase;