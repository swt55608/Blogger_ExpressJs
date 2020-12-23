const MongooseArticleDao = require("../dao/MongooseArticleDao");
const Article = require("../entities/Article");

class EditArticleUseCase {
    constructor(articleDao = new MongooseArticleDao()) {
        this.articleDao = articleDao;
    }

    async execute(oriArticleInfo = {title: '', contents: '', authorname: ''}, newArticleInfo = {title: '', contents: '', authorname: ''}) {
        let oriArticle = new Article(oriArticleInfo);
        let newArticle = new Article(newArticleInfo);
        return await this.articleDao.update(oriArticle, newArticle);
    }
}

module.exports = EditArticleUseCase;