const MongooseArticleDao = require("../dao/MongooseArticleDao");
const Utility = require('../entities/Utility');

class GetAuthorArticlesUseCase {
    constructor(articleDao = new MongooseArticleDao()) {
        this.articleDao = articleDao;
    }

    async execute(authorname = '') {
        let articles = await this.articleDao.findByAuthorName(authorname);
        console.log(articles);
        return Utility.convertToJsonObject(articles);
    }
}

module.exports = GetAuthorArticlesUseCase;