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
        : {'name': { '$regex': req.query.name, '$options': 'i' }, 'code': { '$regex': req.query.name, '$options': 'i' }};

    const products = await Product.paginate(whereProduct, {sort: sort, page: page, lean: false});

    const prod = await Product.findById('5ce1202c66108f25046980d8');
    console.log(prod.price);

    console.log(products.data[0].price);
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
        const seller = await Product.findById(id);

        res.render('backend/seller/edit', { title: 'Редактирование продавца', data: seller, error: false });
    } catch (error) {
        next();
    }
};

const editAction = async (req, res, next) => {
    const id = req.params.id;
    const { name, slug, logo } = req.body;

    try {
        const ajv = new Ajv({verbose: true});
        const validSeller = ajv.validate(ProductJsonSchema, req.body);

        if (!validSeller) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const seller = await Product.findById(id);

        seller.name = name;
        seller.slug = slug;

        if (logo) {
            const filename = Product.getUniqueFilename();
            await fs.outputFile(`${sellerImgPath}${filename}`, logo, 'base64');
            seller.logo = filename;
        }

        await seller.save();

        req.flash('success', 'Продавец был успешно отредактирована.');

        res.redirect('/backend/seller');
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'Продавец с такой постоянной ссылкой уже существует.';
        }

        res.render('backend/seller/edit', { title: 'Редактирование продавца', data: req.body, error: error.message });
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
    const { code, slug } = req.body;
    const messages = [];

    const hasCode = await Product.findOne({code: code});
    const hasSlug = await Product.findOne({slug: slug});

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

module.exports.indexView = indexView;
module.exports.createView = createView;
module.exports.createAction = createAction;
module.exports.editView = editView;
module.exports.editAction = editAction;
module.exports.deleteAction = deleteAction;
module.exports.getSlug = getSlug;
module.exports.prevalidation = prevalidation;
module.exports.canDelete = canDelete;