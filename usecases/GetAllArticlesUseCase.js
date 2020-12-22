const Utility = require('../entities/Utility');

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
        let articlesObj = Utility.convertToJsonObject(articles);
        return articlesObj;
    }
}

module.exports = GetAllArticlesUseCase;