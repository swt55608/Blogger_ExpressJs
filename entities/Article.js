class Article {
    constructor(articleObj = {title: '', contents: '', authorname: ''}) {
        this.title = articleObj.title;
        this.contents = articleObj.contents;
        this.authorname = articleObj.authorname;
    }
}

module.exports = Article;