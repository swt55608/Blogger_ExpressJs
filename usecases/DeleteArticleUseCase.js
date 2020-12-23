const MongooseArticleDao = require("../dao/MongooseArticleDao");

class DeleteArticleUseCase {
    constructor(articleDao = new MongooseArticleDao()) {
        this.articleDao = articleDao;
    }

    async execute(title = '', authorname = '') {
        return this.articleDao.delete(title, authorname);
    }
}

module.exports = DeleteArticleUseCase;