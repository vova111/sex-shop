const Category = require('models/category');
const Product = require('models/product');
const Color = require('models/color');
const productImgUrl = require('config').get('path:products:url');

const showProduct = async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const product = await Product.findOne({ slug: slug }).populate('seller').populate('brand').populate('country');
        const category = await Category.findById(product.mainCategory).populate('parent');
        const colors = await Color.find({}).sort({sort: 1});
        const breadcrumbStart = {url: '/catalog', title: 'Каталог товаров'};

        res.render('product/product', {
            product: product,
            photos: getPhotoObject(product.photos),
            headerCatalog: await Category.getCategoryTreeHtmlFromCache(),
            breadcrumb: Category.generateBreadcrumb(breadcrumbStart, category, product),
            colors: colors
        });
    } catch (e) {
        next();
    }
};

const getPhotoObject = (photos) => {
    const array = [];

    for (let i = 0; i < photos.length; i++) {
        if (photos[i].isMain) {
            array.unshift({ name: photos[i].name, class: ' class="active"' })
        } else {
            array.push({ name: photos[i].name, class: '' });
        }
    }

    return {url: productImgUrl, images: array};
};

module.exports.showProduct = showProduct;