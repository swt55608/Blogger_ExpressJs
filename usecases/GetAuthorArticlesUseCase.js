const MongooseArticleDao = require("../dao/MongooseArticleDao");

class GetAuthorArticlesUseCase {
    constructor(articleDao = new MongooseArticleDao()) {
        this.articleDao = articleDao;
    }

    async execute(authorname = '') {
        return this.articleDao.findByAuthorName(authorname);
    }
}

module.exports = GetAuthorArticlesUseCase;