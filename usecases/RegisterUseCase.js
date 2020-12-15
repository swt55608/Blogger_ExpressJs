const MongooseAuthorDao = require("../dao/MongooseAuthorDao");
const Author = require("../entities/Author");
const Validator = require('../entities/Validator');

class RegisterUseCase {
    constructor(authorDao) {
        if (authorDao === undefined)
            this.authorDao = new MongooseAuthorDao();
        this.authorDao = authorDao;
    }

    execute(authorObj = {account: '', password: '', name: ''}) {
        if (Validator.isInvalid(authorObj)) {
            return false;
        } else {
            let author = new Author(authorObj);
            this.authorDao.register(author);
            return true;
        }
    }
}

module.exports = RegisterUseCase;