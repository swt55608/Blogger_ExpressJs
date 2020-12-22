const Article = require('./Article');

class Utility {
    static convertToJsonObject(articles = [new Article({title: '', contents: '', authorname: ''})]) {
        let ret = [];
        for (let article of articles) {
            ret.push({
                title: article.title,
                contents: article.contents,
                authorname: article.authorname
            });
        }
        return ret;
    }
}

module.exports = Utility;