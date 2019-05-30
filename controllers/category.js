const Category = require('models/category');

const showCategory = async (req, res, next) => {
    let title = 'Каталог товаров';
    let category;
    let parent;
    let subCategory;
    const slug = req.params.slug;
    const breadcrumbStart = {url: '/catalog', title: title};

    if (slug) {
        category = await Category.findOne({slug: slug}).populate('parent');

        if (category) {
            title = category.name;
            parent = category.parent ? category.parent : category;
            subCategory = await Category.find({parent: parent.id}).sort({sort: 1});
        }
    } else {
        subCategory = await Category.find({parent: null}).sort({sort: 1});
    }

    res.render('category/catalog', {
        title: title,
        headerCatalog: await Category.getCategoryTreeHtmlFromCache(),
        breadcrumb: generateBreadcrumb(breadcrumbStart, category),
        mainCategory: await Category.getMainCategoryCache(),
        category: category,
        parent: parent,
        subCategory: subCategory
    });
};

const generateBreadcrumb = (start, category) => {
    const breadcrumb = [start];

    if (category) {
        if (category.parent) {
            breadcrumb.push({url: `/${category.parent.slug}`, title: category.parent.name});
        }

        breadcrumb.push({url: `/${category.slug}`, title: category.name});
    }

    let url = '';
    let html = '';

    for (let i = 0; i < breadcrumb.length; i++) {
        const isLast = ((breadcrumb.length - 1) === i);
        url += breadcrumb[i].url;

        if (!isLast) {
            html += `<li><a href="${url}">${breadcrumb[i].title}</a></li>`;
        } else {
            html += `<li class="active">${breadcrumb[i].title}</li>`;
        }
    }

    return html;
};

module.exports.showCategory = showCategory;