var express = require('express');

const GetAllArticlesUseCase = require('../usecases/GetAllArticlesUseCase');
const GetAuthorArticlesUseCase = require('../usecases/GetAuthorArticlesUseCase');
const MongooseArticleDao = require('../dao/MongooseArticleDao');

var router = express.Router();

/* GET home page. */
router.get('/', getAllArticlesFilter, function(req, res, next) {
  res.render('index');
});

router.get('/author_personal_page', getAuthorArticlesFilter, (req, res) => {
  console.log('router.get /author_personal_page');
  res.render('author_personal_page');
});

router.get('/create_article_page', (req, res) => {
  res.render('create_article');
});

router.get('/edit_article_page', (req, res) => {
  let reqQuery = req.query;
  let articleObj = {
    title: reqQuery.title,
    contents: reqQuery.contents,
    authorname: reqQuery.authorname
  };
  res.locals.requestQuery = {};
  res.locals.requestQuery.article = articleObj;
  res.render('edit_article');
});

async function getAllArticlesFilter(req, res, next) {
  let articleDao = new MongooseArticleDao();
  let getAllArticlesUseCase = new GetAllArticlesUseCase(articleDao);
  let allArticles = await getAllArticlesUseCase.execute();
  req.app.locals.applicationScope.allArticles = allArticles;
  next();
}

async function getAuthorArticlesFilter(req, res, next) {
  console.log('getAuthorArticlesFilter');

  // let {authorname} = req.query;
  let authorname = req.session.account;

  let articleDao = new MongooseArticleDao();
  let getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
  let authorArticles = await getAuthorArticlesUseCase.execute(authorname);
  req.app.locals.applicationScope.authorArticles = authorArticles;
  next();
}

module.exports = router;