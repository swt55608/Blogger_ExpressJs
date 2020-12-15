class Validator {
    static isInvalid(obj = {}) {
        let ret = false;
        let item;
        for (let key in obj) {
            item = obj[key];
            if (item === undefined || item === null || item === '') {
                ret = true;
                break;
            }
        }
        return ret;
    }
}

module.exports = Validator;