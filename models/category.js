const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const arrayToTree = require('array-to-tree');
const Product = require('models/product');
let menuHtmlCache;
let mainMenu;

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Category',
        default: null
    },
    sort: {
        type: Schema.Types.Number,
        default: 0
    },
    slug: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    productsCount: {
        type: Schema.Types.Number,
        default: 0
    }
});

categorySchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

categorySchema.virtual('categoryId').get(function () {
    return !this.parent ? null : this.parent.toString();
});

categorySchema.statics.getTreeForMultiSelect = async function (present = []) {
    const categories = await prepareTree();

    const buildGroupSelect = (categories) => {
        let selectHtml = '';

        for (let category of categories) {
            if (typeof(category.children) !== 'undefined' || category.parent === null) {
                selectHtml += `<optgroup label="${category.name}">`;

                if (typeof(category.children) !== 'undefined') {
                    selectHtml += buildGroupSelect(category.children);
                }

                selectHtml += '</optgroup>';
            } else {
                const selected = present.indexOf(category._id) !== -1 ? ' selected' : '';
                selectHtml += `<option value="${category._id}"${selected}>${category.name}</option>`;
            }
        }

        return selectHtml;
    };

    return buildGroupSelect(categories);
};

categorySchema.statics.getCategoryWithParents = async function (children) {
    const categories = await Category.find({_id: {$in: children}}).distinct('parent');
    return categories.concat(children);
};

categorySchema.statics.updateProductCountCache = async function () {
    const aggregatorOpts = [{
        $unwind: "$category"
    }, {
        $group: {
            _id: '$category',
            count: {$sum: 1}
        }
    }];

    const counts = await Product.aggregate(aggregatorOpts);
    const productCountsMap = new Map();

    for (let i = 0; i < counts.length; i++) {
        productCountsMap.set(counts[i]._id.toString(), counts[i].count);
    }

    const categories = await Category.find({}).select('id productsCount').lean();

    for (let i = 0; i < categories.length; i++) {
        const categoryId = categories[i]._id.toString();

        if (productCountsMap.has(categoryId)) {
            const count = productCountsMap.get(categoryId);

            if (count !== categories[i].productsCount) {
                await Category.updateOne({_id: categoryId}, {productsCount: count});
            }
        } else {
            if (categories[i].productsCount > 0) {
                await Category.updateOne({_id: categoryId}, {productsCount: 0});
            }
        }
    }
};

categorySchema.statics.hasSubCategory = async function ($categoryId) {
    const hasSubCat = await Category.findOne({parent: $categoryId});
    return hasSubCat !== null;
};

categorySchema.statics.getCategoryTreeHtmlFromCache = async function () {
    if (!menuHtmlCache) {
        await generateCategoryTreeHtmlCache();
    }

    return menuHtmlCache;
};

categorySchema.statics.getMainCategoryCache = async function () {
    if (!mainMenu) {
        await generateMainCategoryCache();
    }

    return mainMenu;
};

categorySchema.statics.generateBreadcrumb = function (start, category, product = null) {
    const breadcrumb = [start];

    if (category) {
        if (category.parent) {
            breadcrumb.push({url: `/${category.parent.slug}`, title: category.parent.name});
        }

        breadcrumb.push({url: `/${category.slug}`, title: category.name});
    }

    if (product) {
        breadcrumb.push({url: null, title: product.name});
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

categorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.wasNew = this.isNew;
    } else {
        if (this.isModified('parent')) {
            this.wasParentModified = true;
        }
    }

    next();
});

categorySchema.post('save', async function(category, next) {
    if (this.wasNew) {

    } else {
        if (this.wasParentModified) {
            await updateCategoriesInAllProducts();
            await Category.updateProductCountCache();
        }
    }

    await generateCategoryTreeHtmlCache();
    await generateMainCategoryCache();

    next();
});

const prepareTree = async (fields = 'id name parent', where = {}) => {
    const categories = await Category.find(where).select(fields).sort({sort: 1}).lean();
    const json = JSON.stringify(categories);

    return arrayToTree(JSON.parse(json), {
        parentProperty: 'parent',
        customID: '_id'
    });
};

const updateCategoriesInAllProducts = async function () {
    const category = await Category.find({}).select('id parent').lean();
    const categoryMap = new Map();

    for (let i = 0; i < category.length; i++) {
        const parent = category[i].parent ? category[i].parent.toString() : null;
        categoryMap.set(category[i]._id.toString(), parent);
    }

    const changeProductCategories = async () => {
        let product;
        const cursor = Product.find({}).select('id category').cursor({batchSize: 500});

        const fromObjectToString = (categories) => {
            const strArray = [];

            for (let i = 0; i < categories.length; i++) {
                strArray.push(categories[i].toString());
            }

            return strArray;
        };

        const getSubCategories = (categories) => {
            const subCategories = [];

            for (let i = 0; i < categories.length; i++) {
                const parent = categoryMap.get(categories[i]);

                if (parent) {
                    subCategories.push(categories[i]);
                }
            }

            return subCategories;
        };

        const getAllCategoriesWithParents = (categories) => {
            const parents = [];

            for (let i = 0; i < categories.length; i++) {
                const parent = categoryMap.get(categories[i]);

                if (parents.indexOf(parent) === -1) {
                    parents.push(parent);
                }
            }

            return parents.concat(categories);
        };

        const compareCategories = (newCategories, oldCategories) => {
            if (newCategories.length !== oldCategories.length) {
                return false;
            } else {
                for (let i = 0; i < newCategories.length; i++) {
                    if (oldCategories.indexOf(newCategories[i]) === -1) {
                        return false;
                    }
                }
            }

            return true;
        };

        while ((product = await cursor.next())) {
            const productCategories = fromObjectToString(product.category);
            const subCategories = getSubCategories(productCategories);
            const allCategories = getAllCategoriesWithParents(subCategories);

            if (!compareCategories(allCategories, productCategories)) {
                await Product.updateOne({ _id: product._id }, { category: allCategories });
            }
        }
    };

    await changeProductCategories();
};

const generateCategoryTreeHtmlCache = async () => {
    const categories = await prepareTree('id name parent slug');

    const buildMenu = (categories, ulClass, url) => {
        let menuHtml = `<ul class="${ulClass}">`;

        for (let category of categories) {
            let liClass = '';

            if (typeof(category.children) !== 'undefined') {
                liClass = ' class="menu__list"';
            }

            menuHtml += `<li${liClass}><a href="/catalog${url}${category.slug}">${category.name}</a>`;

            if (typeof(category.children) !== 'undefined') {
                menuHtml += buildMenu(category.children, 'menu__drop', `/${category.slug}/`);
            }

            menuHtml += '</li>';
        }

        menuHtml += '</ul>';

        return menuHtml;
    };

    menuHtmlCache = buildMenu(categories, 'menu', '/');
};

const generateMainCategoryCache = async () => {
    mainMenu = await Category.find({parent: null}).sort({sort: 1}).lean();
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;