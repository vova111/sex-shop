const mongoose = require('mongoose');
const Category = require('models/category');
const Product = require('models/product');

const showCategory = async (req, res, next) => {
    let title = 'Каталог товаров';
    let category;
    let parent;
    let subCategory;
    let whereCategory;
    const slug = req.params.slug;
    const breadcrumbStart = {url: '/catalog', title: title};

    if (slug) {
        category = await Category.findOne({slug: slug}).populate('parent');

        if (!category) {
            return next();
        }

        title = category.name;

        if (category.parent) {
            parent = category.parent;
            subCategory = await Category.find({parent: parent.id}).sort({sort: 1});
            whereCategory = [category._id];
        } else {
            parent = category;
            subCategory = await Category.find({parent: category.id}).sort({sort: 1});

            whereCategory = subCategory.map((category) => {
                return category._id;
            });
        }
    } else {
        subCategory = await Category.find({parent: null}).sort({sort: 1});

        whereCategory = subCategory.map((category) => {
            return category._id;
        });
    }

    const products = await Product.find({ category: { $in: whereCategory } }).limit(12);

    res.render('category/catalog', {
        title: title,
        headerCatalog: await Category.getCategoryTreeHtmlFromCache(),
        breadcrumb: generateBreadcrumb(breadcrumbStart, category),
        mainCategory: await Category.getMainCategoryCache(),
        category: category,
        parent: parent,
        subCategory: subCategory,
        maxPrice: await getMaxPrice(whereCategory),
        brands: await getBrands(whereCategory),
        countries: await getCountry(whereCategory),
        products: products
    });
};

const filterProducts = async (req, res, next) => {
    const { categories, brands, countries, price, sort, page } = req.body;

    const convertToObjectId = (array) => {
        const objects = [];

        for (let i = 0; i < array.length; i++) {
            objects.push(mongoose.Types.ObjectId(array[i]));
        }

        return objects;
    };

    const getSelected = (array) => {
        const selected = [];

        for (let i = 0; i < array.length; i++) {
            if (typeof array[i].selected !== 'undefined') {
                selected.push(array[i].id);
            }
        }

        return selected;
    };

    const objectsOfCategories = convertToObjectId(categories);
    const newBrands = await getBrands(objectsOfCategories, brands);
    const newCountries = await getCountry(objectsOfCategories, countries);
    const selectedBrands = getSelected(newBrands);
    const selectedCountries = getSelected(newCountries);

    const where = { category: { $in: objectsOfCategories }, inStock: true };

    if (selectedBrands.length) {
        const objectsOfBrands = convertToObjectId(selectedBrands);

        where['brand'] = { $in: objectsOfBrands };
    }

    if (selectedCountries.length) {
        const objectsOfCountries = convertToObjectId(selectedCountries);

        where['country'] = { $in: objectsOfCountries };
    }

    if (price.min) {
        where['cost.mainCost'] = { $gte: price.min }
    }

    if (price.max) {
        where['cost.mainCost'] = { $lte: price.max }
    }

    const products = await Product.find(where).select('id cost name slug photos').lean();

    res.json({ products, brands: newBrands, countries: newCountries, page });
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

const getMaxPrice = async (category) => {
    const aggregatorOpts = [{
        $match: {
            category: { $in: category }
        }
    }, {
        $project: {
            _id: false,
            price: {
                $cond: {
                    if: { $eq: ["$cost.isDiscount", false] },
                    then: "$cost.mainCost",
                    else: "$cost.discountCost"
                }
            }
        }
    }, {
        $group: {
            _id: null,
            max: { $max: "$price" }
        }
    }];

    const result = await Product.aggregate(aggregatorOpts);

    return result.length ? Math.ceil(Product.getFormattedPrice(result[0].max)) : 0;
};

const getBrands = async (category, selected = []) => {
    const aggregatorOpts = [{
        $match: {
            category: { $in: category }
        }
    }, {
        $group: {
            _id: "$brand"
        }
    }, {
        $lookup: {
            from: 'brands',
            localField: "_id",
            foreignField: "_id",
            as: 'brand'
        }
    }, {
        $project: {
            _id: false,
            brand: { $arrayElemAt: [ "$brand", 0 ] }
        }
    }, {
        $sort: {
            "brand.name": 1
        }
    }];

    const results = await Product.aggregate(aggregatorOpts);
    const brands = [];

    if (results.length) {
        for (let i = 0; i < results.length; i++) {
            const id = results[i].brand._id.toString();
            const brand = { id: id, name: results[i].brand.name };

            if (selected.indexOf(id) !== -1) {
                brand['selected'] = true;
            }

            brands.push(brand);
        }
    }

    return brands;
};

const getCountry = async (category, selected = []) => {
    const aggregatorOpts = [{
        $match: {
            category: { $in: category }
        }
    }, {
        $group: {
            _id: "$country"
        }
    }, {
        $lookup: {
            from: 'countries',
            localField: "_id",
            foreignField: "_id",
            as: 'country'
        }
    }, {
        $project: {
            _id: false,
            country: { $arrayElemAt: [ "$country", 0 ] }
        }
    }, {
        $sort: {
            "country.name": 1
        }
    }];

    const results = await Product.aggregate(aggregatorOpts);
    const countries = [];

    if (results.length) {
        for (let i = 0; i < results.length; i++) {
            const id = results[i].country._id.toString();
            const country = { id: id, name: results[i].country.name };

            if (selected.indexOf(id) !== -1) {
                country['selected'] = true;
            }

            countries.push(country);
        }
    }

    return countries;
};

module.exports.showCategory = showCategory;
module.exports.filterProducts = filterProducts;