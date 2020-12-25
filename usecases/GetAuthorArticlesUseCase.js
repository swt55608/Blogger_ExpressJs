const MongooseArticleDao = require("../dao/MongooseArticleDao");
const Utility = require('../entities/Utility');

class GetAuthorArticlesUseCase {
    constructor(articleDao = new MongooseArticleDao()) {
        this.articleDao = articleDao;
    }

    async execute(authorname = '') {
        console.log(`GetAuthorArticlesUseCase.execute(${authorname})`);

        let articles = await this.articleDao.findByAuthorName(authorname);
        return Utility.convertCustomArrayToJsonObject(articles);
    }
}

module.exports = GetAuthorArticlesUseCase;