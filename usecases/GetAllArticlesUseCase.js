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
        let articlesObj = this.convertArticlesToObject(articles);
        return articlesObj;
    }

    convertArticlesToObject(articles) {
        let articlesObj = [];
        for (let article of articles) {
            articlesObj.push({title: article.title, contents: article.contents, authorname: article.authorname});
        }
        return articlesObj;
    }
}

module.exports = GetAllArticlesUseCase;