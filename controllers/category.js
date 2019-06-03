const mongoose = require('mongoose');
const Category = require('models/category');
const Product = require('models/product');

const showCategory = async (req, res, next) => {
    let title = 'Каталог товаров';
    let category;
    let parent;
    let subCategory;
    let whereCategory;
    const search = req.body.search !== undefined ? req.body.search : '';
    const slug = req.params.slug;
    const breadcrumbStart = {url: '/catalog', title: title};
    const limit = 12;

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

    const where = { category: { $in: whereCategory }, inStock: true };

    if (search) {
        title = `Поиск: ${search}`;
        where['name'] = { '$regex': search, '$options': 'i' };
    }

    const products = await Product.find(where)
        .select('id cost name mainCategory slug photos isBestseller isPremium isOnlyHere')
        .populate('mainCategory', 'name')
        .sort({ rating: -1 })
        .limit(limit);

    res.render('category/catalog', {
        title: title,
        headerCatalog: await Category.getCategoryTreeHtmlFromCache(),
        breadcrumb: Category.generateBreadcrumb(breadcrumbStart, category),
        mainCategory: await Category.getMainCategoryCache(),
        category: category,
        parent: parent,
        subCategory: subCategory,
        price: await getMinAndMaxPrice(whereCategory),
        brands: await getBrands(whereCategory),
        countries: await getCountry(whereCategory),
        products: products,
        searchText: search
    });
};

const filterProducts = async (req, res, next) => {
    const { categories, tags, brands, countries, search, price, isPrice, sort, page } = req.body;

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
    const newPrice = await getMinAndMaxPrice(objectsOfCategories);

    const where = { category: { $in: objectsOfCategories }, inStock: true };

    if (selectedBrands.length) {
        const objectsOfBrands = convertToObjectId(selectedBrands);

        where['brand'] = { $in: objectsOfBrands };
    }

    if (selectedCountries.length) {
        const objectsOfCountries = convertToObjectId(selectedCountries);

        where['country'] = { $in: objectsOfCountries };
    }

    if (price.min && price.max) {
        where['cost.currentCost'] = {
            $gte: Product.getConvertedPrice(price.min),
            $lte: Product.getConvertedPrice(price.max)
        };
    } else {
        if (price.min) {
            where['cost.currentCost'] = { $gte: Product.getConvertedPrice(price.min) };
        }

        if (price.max) {
            where['cost.currentCost'] = { $lte: Product.getConvertedPrice(price.max) };
        }
    }

    if (tags.indexOf('discount') !== -1) {
        where['cost.isDiscount'] = true;
    }

    if (tags.indexOf('bestseller') !== -1) {
        where['isBestseller'] = true;
    }

    if (tags.indexOf('premium') !== -1) {
        where['isPremium'] = true;
    }

    if (tags.indexOf('only') !== -1) {
        where['isOnlyHere'] = true;
    }

    if (search) {
        where['name'] = { '$regex': search, '$options': 'i' };
    }

    let order;

    switch (sort) {
        case 'rating':
            order = { rating: -1 };
            break;
        case 'new':
            order = { createdAt: -1 };
            break;
        case 'cheap':
            order = { 'cost.currentCost': 1 };
            break;
        case 'expensive':
            order = { 'cost.currentCost': -1 };
            break;
        default:
            order = { rating: -1 };
            break;
    }

    const limit = 12;

    const products = await Product.find(where)
        .select('id cost name mainCategory slug photos isBestseller isPremium isOnlyHere')
        .populate('mainCategory', 'name')
        .sort(order)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    res.json({ products, brands: newBrands, countries: newCountries, price: newPrice, isPrice, page });
};

const getMinAndMaxPrice = async (category) => {
    const aggregatorOpts = [{
        $match: {
            category: { $in: category }
        }
    }, {
        $group: {
            _id: null,
            min: { $min: "$cost.currentCost" },
            max: { $max: "$cost.currentCost" }
        }
    }];

    const result = await Product.aggregate(aggregatorOpts);

    let min = 0;
    let max = 0;

    if (result.length) {
        min = Math.floor(Product.getFormattedPrice(result[0].min));
        max = Math.ceil(Product.getFormattedPrice(result[0].max));
    }

    return { min: min, max: max};
};

const getBrands = async (category, selected = []) => {
    const aggregatorOpts = [{
        $match: {
            category: { $in: category },
            brand: { $ne: null }
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
            category: { $in: category },
            country: { $ne: null }
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