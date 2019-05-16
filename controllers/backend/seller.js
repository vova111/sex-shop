const Seller = require('models/seller');
const SellerJsonSchema = require('schemes/seller');
const Ajv = require('ajv/lib/ajv');
const pagination = require('classes/boostrapPaginator');
const queryStringBuilder = require('classes/queryStringBuilder');
const slugify = require('@sindresorhus/slugify');
const sellerImgPath = require('config').get('path:sellers:logo');
const fs = require('fs-extra');

const indexView = async (req, res, next) => {
    const page = typeof req.query.page === 'undefined' ? 1 : Number(req.query.page);
    const sort = {_id: 'DESC'};

    const whereSeller = typeof req.query.name === 'undefined'
        ? {}
        : {'name': { '$regex': req.query.name, '$options': 'i' }};

    const sellers = await Seller.paginate(whereSeller, {sort: sort, page: page});

    const prelink = '/backend/seller' + queryStringBuilder.buildString(req.url);
    const paginator = pagination.create(prelink, sellers.page, sellers.limit, sellers.total);
    const paginationData = paginator.getPaginationData();

    res.render('backend/seller/index', {
        title: 'Список продавцов',
        data: req.query,
        sellers: sellers.data,
        counter: paginationData.fromResult,
        paginator: paginator,
        paginationData: paginationData
    }, (err, html) => {
        req.session.flash = [];
        res.send(html);
    });
};

const createView = async (req, res, next) => {
    res.render('backend/seller/create', { title: 'Создать нового продавца', data: {}, error: false });
};

const createAction = async (req, res, next) => {
    const { name, slug, logo } = req.body;

    try {
        const ajv = new Ajv({verbose: true});
        const validSeller = ajv.validate(SellerJsonSchema, req.body);

        if (!validSeller) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const seller = new Seller({
            name: name,
            slug: slug
        });

        if (logo) {
            const filename = `${slug}.jpg`;
            await fs.outputFile(`${sellerImgPath}${filename}`, logo, 'base64');
            seller.logo = filename;
        }

        await seller.save();

        req.flash('success', 'Новый продавец был успешно добавлен.');

        res.redirect('/backend/seller');
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'Продавец с такой постоянной ссылкой уже существует.';
        }

        res.render('backend/seller/create', { title: 'Создать нового продавца', data: req.body, error: error.message });
    }
};

const editView = async (req, res, next) => {
    const id = req.params.id;

    try {
        const seller = await Seller.findById(id);

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
        const validSeller = ajv.validate(SellerJsonSchema, req.body);

        if (!validSeller) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const seller = await Seller.findById(id);

        seller.name = name;
        seller.slug = slug;

        // slug не подходит
        if (logo) {
            const filename = `${slug}.jpg`;
            await fs.outputFile(`${sellerImgPath}${filename}`, logo, 'base64');
            seller.logo = filename;
        }

        await seller.save();

        req.flash('success', 'Продавец был успешно отредактирована.');

        res.redirect('/backend/seller');
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'Категория с такой постоянной ссылкой уже существует.';
        }

        res.render('backend/seller/edit', { title: 'Редактирование продавца', data: req.body, error: error.message });
    }
};

const deleteAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const seller = await Seller.findById(id);
        await seller.delete();

        req.flash('success', 'Продавец был успешно удален.');

        res.redirect('/backend/seller');
    } catch (error) {
        next();
    }
};

const getSlug = (req, res, next) => {
    res.json({status: true, slug: slugify(req.body.name).substring(0, 100)});
};

const canDelete = async (req, res, next) => {
    // try {
    //     const count = await Seller.countDocuments({parent: req.body.id});
    //     const message = !count ? '' : 'Вы не можете удалить эту категорию, так как она содержит вложенные подкатегории!';
    //
    //     res.json({status: true, count: count, message: message});
    // } catch (error) {
    //     res.json({status: false});
    // }
};

module.exports.indexView = indexView;
module.exports.createView = createView;
module.exports.createAction = createAction;
module.exports.editView = editView;
module.exports.editAction = editAction;
module.exports.deleteAction = deleteAction;
module.exports.getSlug = getSlug;
module.exports.canDelete = canDelete;