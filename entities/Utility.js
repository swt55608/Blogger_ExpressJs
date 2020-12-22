const Article = require('./Article');

class Utility {
    static convertToJsonObject(articles = [new Article({title: '', contents: '', authorname: ''})]) {
        if (articles[0] !== undefined && !(articles[0] instanceof Article))
            throw 'Invalid Type: Parameter should be Article';
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