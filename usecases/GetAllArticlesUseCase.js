const Utility = require('../entities/Utility');
const MongooseArticleDao = require('../dao/MongooseArticleDao');

class GetAllArticlesUseCase {
    constructor(articleDao) {
        if (articleDao === undefined) {
            this.articleDao = new MongooseArticleDao();
        } else {
            this.articleDao = articleDao;
        }
    }

    async execute() {
        let articles = await this.articleDao.findAll();
        let articlesObj = Utility.convertCustomArrayToJsonObject(articles);
        return articlesObj;
    }
}

module.exports = GetAllArticlesUseCase;