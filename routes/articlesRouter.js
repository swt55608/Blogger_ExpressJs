const express = require('express');

const MongooseArticleDao = require('../dao/MongooseArticleDao');
const CreateArticleUseCase = require('../usecases/CreateArticleUseCase');
const GetAllArticlesUseCase = require('../usecases/GetAllArticlesUseCase');
const GetAuthorArticlesUseCase = require('../usecases/GetAuthorArticlesUseCase');
const EditArticleUseCase = require('../usecases/EditArticleUseCase');
const DeleteArticleUseCase = require('../usecases/DeleteArticleUseCase');

const router = express.Router();

router.post('/', async (req, res) => {
    let reqBody = req.body;
    let reqSession = req.session;
    let statusCode = 400, responseObj = {msg: 'Failed at creating an article'};
    let renderToPage = 'create_article';
    if (reqBody && reqSession) {
        let articleObj = {
            title: reqBody.title,
            contents: reqBody.contents,
            authorname: reqSession.account
        };
        let articleDao = new MongooseArticleDao();
        let createArticleUseCase = new CreateArticleUseCase(articleDao);
        let isCreated = await createArticleUseCase.execute(articleObj);
        if (isCreated) {
            statusCode = 201;
            responseObj.msg = 'Successfully Created an Article';
            responseObj.article = articleObj;
            renderToPage = 'author_personal_page';
            await updateSessionArticles(req, res, articleObj.authorname);
        }
    }
    // res.status(statusCode).json(responseObj);
    res.status(statusCode).render(renderToPage);
});

// router.get('/', async (req, res) => {
//     let statusCode = 400, responseObj = {msg: 'Failed at getting articles'};

//     let articlesObj = await getAllArticles();

//     statusCode = 200;
//     responseObj.msg = 'Successfully at Getting all Articles';
//     responseObj.article = articlesObj;
//     res.status(statusCode).json(responseObj);
// });

// router.get('/authors/:authorname', async (req, res) => {
//     let {authorname} = req.params;
//     let statusCode = 400, responseObj = {msg: 'Failed at getting articles'};

//     let articlesObj = await getAuthorArticles(authorname);

//     statusCode = 200;
//     responseObj.msg = `Successfully at Getting ${authorname}\' Articles`;
//     responseObj.article = articlesObj;
//     res.status(statusCode).json(responseObj);
// });

async function getAllArticles() {
    let articleDao = new MongooseArticleDao();
    let getAllArticlesUseCase = new GetAllArticlesUseCase(articleDao);
    return getAllArticlesUseCase.execute();
}

async function getAuthorArticles(authorname = '') {
    let articleDao = new MongooseArticleDao();
    let getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
    return getAuthorArticlesUseCase.execute(authorname);
}

router.put('/:title/authors/:authorname', async (req, res) => {
    let reqBody = req.body;
    let {title, authorname} = req.params;
    let statusCode = 400, responseObj = {msg: 'Failed at editting the article'};
    let renderToPage = '/edit_article';
    if (reqBody) {
        let oriArticleInfo = {title: title, authorname: authorname};
        let newArticleInfo = {
            title: reqBody.title,
            contents: reqBody.contents,
            authorname: reqBody.authorname
        };
        let articleDao = new MongooseArticleDao();
        let editArticleUseCase = new EditArticleUseCase(articleDao);
        let isEdited = await editArticleUseCase.execute(oriArticleInfo, newArticleInfo);
        if (isEdited) {
            statusCode = 200;
            responseObj.msg = `Successfully at Editting ${authorname}\' Articles`;
            renderToPage = '/author_personal_page';
            await updateSessionArticles(req, res, authorname);
        }
    }

    // res.status(statusCode).json(responseObj);
    res.status(statusCode).json({renderToPage: renderToPage});
    // res.end();
});

router.delete('/:title/authors/:authorname', async (req, res) => {
    let {title, authorname} = req.params;
    let statusCode = 400, responseObj = {msg: 'Failed at deleting the article'};
    let articleDao = new MongooseArticleDao();
    let deleteArticleUseCase = new DeleteArticleUseCase(articleDao);
    let isDeleted = await deleteArticleUseCase.execute(title, authorname);

    if(isDeleted) {
        statusCode = 200;
        responseObj.msg = 'Successfully at Deleting Articles';
        await updateSessionArticles(req, res, authorname);
    }
    
    // res.status(statusCode).json(responseObj);
    // res.status(statusCode).render('author_articles');
    res.end();
});

async function updateSessionArticles(req, res, authorname = '') {
    let authorArticlesObj = await getAuthorArticles(authorname);
    let allArticlesObj = await getAllArticles();
    req.app.locals.applicationScope.authorArticles = authorArticlesObj;
    req.app.locals.applicationScope.allArticles = allArticlesObj;
}

module.exports = router;