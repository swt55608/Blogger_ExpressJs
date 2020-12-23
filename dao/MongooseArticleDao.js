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
                // console.log('Saved article');
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

    async findByTitleAndAuthorname(searchTitle = '', searchAuthorname = '') {
        let articleModel = await ArticleModel.findOne({$and: [{title: searchTitle}, {authorname: searchAuthorname}]})
            .then(doc => {
                // console.log(doc);
                if (doc)
                    return doc;
                return null;
            }).catch(err => {
                console.error(err);
                return null;
            });
        let article = null;
        if (articleModel) {
            article = new Article({
                title: articleModel.title,
                contents: articleModel.contents,
                authorname: articleModel.authorname
            });
        }
        return article;
    }
    
    async update(oriArticle = new Article(), newArticle = new Article()) {
        let title = newArticle.title;
        if (title === undefined || title === null || title === '') {
            return false;
        } else {
            if (await this.findByTitleAndAuthorname(oriArticle.title, newArticle.authorname) === null) {
                return false;
            } else {
                return ArticleModel.updateOne({$and: [{title: oriArticle.title}, {authorname: oriArticle.authorname}]}, newArticle)
                .then(reply => {
                    // console.log(reply);
                    if (reply.nModified > 0)
                        return true;
                    return false;
                }).catch(err => {
                    console.error(err);
                    return false;
                });
            }
        }
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

////////////////////////////////////////////////////////////////////////
// const mongoose = require('mongoose');
// const Utility = require('../entities/Utility');

// mongoose.connect('mongodb://localhost:27017/blogger_test', {useNewUrlParser: true, useUnifiedTopology: true});
// let db = mongoose.connection;
// db.on('error', () => console.error('Could not connect to MongoDB'));
// db.on('open', () => console.log('Connected to MongoDB'));
// db.on('close', () => console.log('Close Connection to MongoDB'));

// (async function() {
//     let articleDao = new MongooseArticleDao();

//     let oriArticleInfo = {title: 'Happy Day', contents: 'Today is a nice day.', authorname: 'mike'};
//     let newArticleInfo = {title: oriArticleInfo.title, contents: oriArticleInfo.contents, authorname: 'jack'};

//     await articleDao.create(oriArticleInfo);
//     let isUpdated = await articleDao.update(oriArticleInfo, newArticleInfo);
//     console.log(isUpdated);

//     // db.close();
// })();
////////////////////////////////////////////////////////////////////////

module.exports = MongooseArticleDao;