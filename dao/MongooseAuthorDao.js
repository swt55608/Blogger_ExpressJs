const AuthorModel = require('./Author.model');
const Author = require('../entities/Author');

class MongooseAuthorDao {
    async register(author = new Author('account', 'password', 'name')) {
        if (!(author instanceof Author))
            throw 'Invalid Type: Parameter should be Author';
        let authorModel = new AuthorModel({
            account: author.account,
            password: author.password,
            name: author.name
        });

        if (await this.isExist(author)) {
            return false;
        } else {
            return authorModel.save()
                .then(doc => {
                    // console.log('Saved');
                    return true;
                }).catch(err => {
                    // console.log('Saved Failure');
                    // console.error(err);
                    return false;
                });
        }
    }

    async login(author) {
        if (!(author instanceof Author))
            throw 'Invalid Type: Parameter should be Author';
        return AuthorModel.findOne({account: author.account, password: author.password})
            .then(doc => {
                if (doc)
                    return true;
                return false;
            }).catch(err => {
                console.error(err);
                return false;
            });
    }

    async isExist(author) {
        return AuthorModel.findOne({$or: [{account: author.account}, {name: author.name}]})
            .then(doc => {
                // console.log(doc);
                if (doc != null)
                    return true;
                return false;
            }).catch(err => {
                console.error(err);
                return false;
            });
    }
}

module.exports = MongooseAuthorDao;