const MongooseAuthorDao = require("../dao/MongooseAuthorDao");
const Author = require("../entities/Author");
const Validator = require('../entities/Validator');

class RegisterUseCase {
    constructor(authorDao) {
        if (authorDao === undefined)
            this.authorDao = new MongooseAuthorDao();
        this.authorDao = authorDao;
    }

    async execute(authorObj = {account: '', password: '', name: ''}) {
        let author = new Author(authorObj);
        if (Validator.isInvalid(authorObj)) {
            return false;
        } else if (this.authorDao.isExist(author)) {
            return false;
        } else {
            return await this.authorDao.register(author);
        }
    }
}

module.exports = RegisterUseCase;