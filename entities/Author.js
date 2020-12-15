class Author {
    constructor(authorObj = {account: '', password: '', name: ''}) {
        this.account = authorObj.account;
        this.password = authorObj.password;
        this.name = authorObj.name;
    }
}

module.exports = Author;