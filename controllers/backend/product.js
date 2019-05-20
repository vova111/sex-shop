const Product = require('models/product');
const Country = require('models/country');
const Brand = require('models/brand');
const Category = require('models/category');
const ProductJsonSchema = require('schemes/product');
const Ajv = require('ajv/lib/ajv');
const pagination = require('classes/boostrapPaginator');
const queryStringBuilder = require('classes/queryStringBuilder');
const slugify = require('@sindresorhus/slugify');
const productImgPath = require('config').get('path:products:photo');
const productThumbImgPath = require('config').get('path:products:thumb:photo');
const fs = require('fs-extra');

const indexView = async (req, res, next) => {
    const page = typeof req.query.page === 'undefined' ? 1 : Number(req.query.page);
    const sort = {_id: 'DESC'};

    const whereProduct = typeof req.query.name === 'undefined'
        ? {}
        : {$or: [{'name': { '$regex': req.query.name, '$options': 'i' }}, {'code': { '$regex': req.query.name, '$options': 'i' }}]};

    const products = await Product.paginate(whereProduct, {sort: sort, page: page, lean: false});

    const prelink = '/backend/product' + queryStringBuilder.buildString(req.url);
    const paginator = pagination.create(prelink, products.page, products.limit, products.total);
    const paginationData = paginator.getPaginationData();

    res.render('backend/product/index', {
        title: 'Список товаров',
        data: req.query,
        products: products.data,
        counter: paginationData.fromResult,
        paginator: paginator,
        paginationData: paginationData
    }, (err, html) => {
        req.session.flash = [];
        res.send(html);
    });
};

const createView = async (req, res, next) => {
    const countries = await Country.find({}).sort({name: 1});
    const brands = await Brand.find({}).sort({name: 1});
    const categories = await Category.getTreeForMultiSelect();

    res.render('backend/product/create', {
        title: 'Создать новый товар',
        data: {},
        countries: countries,
        brands: brands,
        categories: categories,
        error: false
    });
};

const createAction = async (req, res, next) => {
    try {
        const ajv = new Ajv({verbose: true});
        const validProduct = ajv.validate(ProductJsonSchema, req.body);

        if (!validProduct) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const { name, code, category, slug, short, full } = req.body;
        const specificationNames = req.body.specification_name;
        const specificationValues = req.body.specification_value;
        const imagesThumb = req.body.image_thumb;
        const imagesFull = req.body.image_full;
        const imagesMain = req.body.image_main;
        let { cost, discount, seller, brand, country, stock } = req.body;

        cost = Number(cost);
        discount = discount.length ? Number(discount) : null;
        seller = seller.length ? seller : null;
        brand = brand.length ? brand : null;
        country = country.length ? country : null;
        stock = stock.length ? true : false;

        const images = [];

        if (imagesThumb) {
            for (let i = 0; i < imagesThumb.length; i++) {
                const productImage = {
                    name: Product.getUniqueFilename(),
                    isMain: Number(imagesMain[i])
                };

                await fs.outputFile(`${productThumbImgPath}${productImage.name}`, imagesThumb[i], 'base64');
                await fs.outputFile(`${productImgPath}${productImage.name}`, imagesFull[i], 'base64');

                images.push(productImage);
            }
        }

        const product = new Product({
            name: name,
            code: code,
            inStock: stock,
            slug: slug,
            'cost.mainCost': cost,
            'cost.discountCost': discount,
            'description.short': short,
            'description.full': full,
            specifications: Product.createSpecificationsObject(specificationNames, specificationValues),
            country: country,
            brand: brand,
            seller: seller,
            category: category,
            photos: images
        });

        await product.save();

        req.flash('success', 'Новый товар был успешно добавлен.');

        res.redirect('/backend/product');
    } catch (error) {
        const countries = await Country.find({}).sort({name: 1});
        const brands = await Brand.find({}).sort({name: 1});
        const categories = await Category.getTreeForMultiSelect();

        res.render('backend/product/create', {
            title: 'Создать новый товар',
            data: req.body,
            countries: countries,
            brands: brands,
            categories: categories,
            error: error.message
        });
    }
};

const editView = async (req, res, next) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id).populate('seller', 'id name');
        const countries = await Country.find({}).sort({name: 1});
        const brands = await Brand.find({}).sort({name: 1});
        const categories = await Category.getTreeForMultiSelect(product.category);

        res.render('backend/product/edit', {
            title: 'Редактирование товара',
            data: product,
            countries: countries,
            brands: brands,
            categories: categories,
            error: false
        });
    } catch (error) {
        next();
    }
};

const editAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const ajv = new Ajv({verbose: true});
        const validProduct = ajv.validate(ProductJsonSchema, req.body);

        if (!validProduct) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const product = await Product.findById(id);

        const { name, code, category, slug, short, full } = req.body;
        const specificationNames = req.body.specification_name;
        const specificationValues = req.body.specification_value;
        const imagesThumb = req.body.image_thumb;
        const imagesFull = req.body.image_full;
        const imagesMain = req.body.image_main;
        let { cost, discount, seller, brand, country, stock } = req.body;

        cost = Number(cost);
        discount = discount.length ? Number(discount) : null;
        seller = seller.length ? seller : null;
        brand = brand.length ? brand : null;
        country = country.length ? country : null;
        stock = stock.length ? true : false;

        if (imagesThumb) {
            const images = [];
            let hasMainImage = false;

            for (let i = 0; i < imagesThumb.length; i++) {
                const isMain = Number(imagesMain[i]);

                const productImage = {
                    _id: Product.getObjectId(),
                    name: Product.getUniqueFilename(),
                    isMain: isMain
                };

                if (isMain) {
                    hasMainImage = true;
                }

                await fs.outputFile(`${productThumbImgPath}${productImage.name}`, imagesThumb[i], 'base64');
                await fs.outputFile(`${productImgPath}${productImage.name}`, imagesFull[i], 'base64');

                images.push(productImage);
            }

            if (hasMainImage) {
                await Product.clearMainImage(id);
            }

            for (let i = 0; i < images.length; i++) {
                product.photos.push(images[i]);
            }
        }

        product.name = name;
        product.code = code;
        product.inStock = stock;
        product.slug = slug;
        product.cost.mainCost = cost;
        product.cost.discountCost = discount;
        product.description.short = short;
        product.description.full = full;
        product.specifications = Product.createSpecificationsObject(specificationNames, specificationValues);
        product.country = country;
        product.brand = brand;
        product.seller = seller;
        product.category = category;

        await product.save();

        req.flash('success', 'Товар был успешно отредактирована.');

        res.redirect('/backend/product');
    } catch (error) {
        const countries = await Country.find({}).sort({name: 1});
        const brands = await Brand.find({}).sort({name: 1});
        const categories = await Category.getTreeForMultiSelect(req.body.category);
        console.log(error.message);
        res.render('backend/product/edit', {
            title: 'Редактирование товара',
            data: req.body,
            countries: countries,
            brands: brands,
            categories: categories,
            error: error.message
        });
    }
};

const deleteAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const seller = await Product.findById(id);
        await seller.delete();

        req.flash('success', 'Продавец был успешно удален.');

        res.redirect('/backend/seller');
    } catch (error) {
        next();
    }
};

const getSlug = (req, res, next) => {
    res.json({status: true, slug: slugify(req.body.name).substring(0, 200)});
};

const prevalidation = async (req, res, next) => {
    const { code, slug, productId } = req.body;
    const messages = [];

    const hasCodeWhere = productId ? {code: code, _id: {$ne: productId}} : {code: code};
    const hasCodeSlug = productId ? {slug: slug, _id: {$ne: productId}} : {slug: slug};

    const hasCode = await Product.findOne(hasCodeWhere);
    const hasSlug = await Product.findOne(hasCodeSlug);

    if (hasCode) {
        messages.push(' Товар с таким кодом уже существует');
    }

    if (hasSlug) {
        messages.push(' Товар с такой постоянной ссылкой уже существует');
    }

    res.json({status: true, messages: messages});
};

const canDelete = async (req, res, next) => {
    try {
        // const count = await Product.countDocuments({parent: req.body.id});
        // Здесь нужно проверять сколько у продавца товара когда будет готова модель Товаров
        const count = 0;
        const message = !count ? '' : 'Вы не можете удалить этого продавца, так как у него имеются товары!';

        res.json({status: true, count: count, message: message});
    } catch (error) {
        res.json({status: false});
    }
};

const setMainImage = async (req, res, next) => {
    const { imageId, productId } = req.body;
    const result = await Product.setNewMainImage(imageId, productId);

    res.json({status: true, result: !!result.ok});
};

const removeImage = async (req, res, next) => {
    const { imageId, productId } = req.body;
    await Product.removeImage(imageId, productId);

    res.json({status: true, result: true});
};

module.exports.indexView = indexView;
module.exports.createView = createView;
module.exports.createAction = createAction;
module.exports.editView = editView;
module.exports.editAction = editAction;
module.exports.deleteAction = deleteAction;
module.exports.getSlug = getSlug;
module.exports.prevalidation = prevalidation;
module.exports.canDelete = canDelete;
module.exports.setMainImage = setMainImage;
module.exports.removeImage = removeImage;