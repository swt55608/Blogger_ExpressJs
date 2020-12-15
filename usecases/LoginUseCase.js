const MongooseAuthorDao = require("../dao/MongooseAuthorDao");
const Author = require("../entities/Author");
const Validator = require("../entities/Validator");

class LoginUseCase {
    constructor(authorDao) {
        if (authorDao === undefined) 
            authorDao = new MongooseAuthorDao();
        this.authorDao = authorDao;
    }

    async execute(loginInfo = {account: '', password: ''}) {
        let author = new Author(loginInfo);
        if (Validator.isInvalid(loginInfo)) {
            return false;
        } else {
            return this.authorDao.login(author);
        }
    }
}

module.exports = LoginUseCase;