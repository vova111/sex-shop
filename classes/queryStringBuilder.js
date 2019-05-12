const urlParse = require('url-parse');
const ignoredParams = ['page'];

const buildString = (url, ingnored = null) => {
    let queryString = '';
    const urlComponents = urlParse(url, true);

    if (ingnored) {
        addToIgnored();
    }

    for (let prop in urlComponents.query) {
        if (ignoredParams.indexOf(prop) === -1) {
            queryString += `${prop}=${urlComponents.query[prop]}&`;
        }
    }

    if (queryString.length) {
        queryString = '?' + queryString.substring(0, queryString.length - 1);
    }

    return queryString;
};

const addToIgnored = (ingnored) => {
    for (let i = 0; i < ingnored.length; i++) {
        ignoredParams.push(ingnored[i]);
    }
};

module.exports.buildString = buildString;