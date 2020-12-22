const Article = require("../entities/Article");
const ArticleModel = require('./Article.model');

class MongooseArticleDao {
    async create(article = new Article({title: '', contents: '', authorname: ''})) {
        let articleModel = new ArticleModel({
            title: article.title,
            contents: article.contents,
            authorname: article.authorname
        });

        if (await this.isExist(article)) {
            return false;
        } else {
            return articleModel.save()
            .then(doc => {
                console.log('Saved article');
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            });
        }
    }

    async findAll() {
        let articles = [];
        let articlesModel = await ArticleModel.find();
        for (let articleModel of articlesModel) {
            articles.push(new Article({
                title: articleModel.title,
                contents: articleModel.contents,
                authorname: articleModel.authorname
            }));
        }
        return articles;
    }

    async findByAuthorName(searchAuthorname = '') {
        let articles = [];
        let articlesModel = await ArticleModel.find({authorname: searchAuthorname});
        for (let articleModel of articlesModel) {
            articles.push(new Article({
                title: articleModel.title,
                contents: articleModel.contents,
                authorname: articleModel.authorname
            }));
        }
        return articles;
    }

    async isExist(article = new Article({title: '', contents: '', authorname: ''})) {
        return ArticleModel.findOne({title: article.title})
            .then(doc => {
                // console.log(doc);
                if (doc != null)
                    return true;
                return false;
            }).catch(err => {
                return false;
            });
    }

    isInvalid(article = new Article({title: '', contents: '', authorname: ''})) {
        return article.title === undefined || article.title === null || article.title === ''
            || article.contents === undefined || article.contents === null
            || article.authorname === undefined || article.authorname === null || article.authorname === '';
    }
}

module.exports = MongooseArticleDao;