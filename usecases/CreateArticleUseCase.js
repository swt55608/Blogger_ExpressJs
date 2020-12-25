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
            console.log('isInvalid');
            return false;
        } else if (await this.articleDao.isExist(article)) {
            console.log('isExist');
            return false;
        } else {
            console.log('articleDao.create');
            return this.articleDao.create(article);
        }
    }
}

module.exports = CreateArticleUseCase;