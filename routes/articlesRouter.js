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
    let statusCode = 400, responseObj = {msg: 'Failed at creating an article'};
    if (reqBody) {
        let articleObj = {
            title: reqBody.title,
            contents: reqBody.contents,
            authorname: reqBody.authorname
        };
        let articleDao = new MongooseArticleDao();
        let createArticleUseCase = new CreateArticleUseCase(articleDao);
        let isCreated = await createArticleUseCase.execute(articleObj);
        if (isCreated) {
            statusCode = 201;
            responseObj.msg = 'Successfully Created an Article';
            responseObj.article = articleObj;
        }
    }
    res.status(statusCode).json(responseObj);
});

router.get('/', async (req, res) => {
    let statusCode = 400, responseObj = {msg: 'Failed at getting articles'};
    let articleDao = new MongooseArticleDao();
    let getAllArticlesUseCase = new GetAllArticlesUseCase(articleDao);
    let articlesObj = await getAllArticlesUseCase.execute();
    statusCode = 200;
    responseObj.msg = 'Successfully at Getting all Articles';
    responseObj.article = articlesObj;
    res.status(statusCode).json(responseObj);
});

router.get('/authors/:authorname', async (req, res) => {
    let {authorname} = req.params;
    let statusCode = 400, responseObj = {msg: 'Failed at getting articles'};
    let articleDao = new MongooseArticleDao();
    let getAuthorArticlesUseCase = new GetAuthorArticlesUseCase(articleDao);
    let articlesObj = await getAuthorArticlesUseCase.execute(authorname);
    statusCode = 200;
    responseObj.msg = `Successfully at Getting ${authorname}\' Articles`;
    responseObj.article = articlesObj;
    res.status(statusCode).json(responseObj);
});

router.put('/:title/authors/:authorname', async (req, res) => {
    let reqBody = req.body;
    let {title, authorname} = req.params;
    let statusCode = 400, responseObj = {msg: 'Failed at editting the article'};

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
            responseObj.msg = `Successfully at Editting ${authorname}\' Articles`;
        }
    }

    res.status(statusCode).json(responseObj);
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
    }
    
    res.status(statusCode).json(responseObj);
});

module.exports = router;