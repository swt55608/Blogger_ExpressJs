const AuthorModel = require('./Author.model');
const Author = require('../entities/Author');

class MongooseAuthorDao {
    register(author = new Author('account', 'password', 'name')) {
        if (!(author instanceof Author))
            throw 'Invalid Type: Parameter should be Author';
        let authorModel = new AuthorModel({
            account: author.account,
            password: author.password,
            name: author.name
        });
        authorModel.save()
            .then(doc => {
                console.log('Saved');
            }).catch(err => {
                console.log('Saved Failure');
                console.error(err);
            });
    }
}

module.exports = MongooseAuthorDao;