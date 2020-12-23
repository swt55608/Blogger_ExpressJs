const Article = require('./Article');

class Utility {
    static convertCustomArrayToJsonObject(articles = [new Article({title: '', contents: '', authorname: ''})]) {
        if (articles[0] !== undefined && !(articles[0] instanceof Article))
            throw 'Invalid Type: Parameter should be Article';
        let ret = [];
        for (let article of articles) {
            let articleObj = {};
            for (let key in article)
                articleObj[key] = article[key];
            ret.push(articleObj);
        }
        return ret;
    }

    static convertToJsonObject(article = new Article()) {
        let ret = {};
        for (let key in article) {
            ret[key] = article[key];
        }
        return ret;
    }
}

module.exports = Utility;