const Category = require('models/category');

const showHome = async (req, res, next) => {
    res.render('home/home', {
        title: 'Секс Шоп - Lureshop',
        headerCatalog: await Category.getCategoryTreeHtmlFromCache()
    });
};

module.exports.showHome = showHome;