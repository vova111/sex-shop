const Brand = require('models/brand');
const BrandJsonSchema = require('schemes/brand');
const Ajv = require('ajv/lib/ajv');
const pagination = require('classes/boostrapPaginator');
const queryStringBuilder = require('classes/queryStringBuilder');

const indexView = async (req, res, next) => {
    const page = typeof req.query.page === 'undefined' ? 1 : Number(req.query.page);
    const sort = {_id: 'DESC'};

    const whereBrand = typeof req.query.name === 'undefined'
        ? {}
        : {'name': { '$regex': req.query.name, '$options': 'i' }};

    const brands = await Brand.paginate(whereBrand, {sort: sort, page: page});

    const prelink = '/backend/country' + queryStringBuilder.buildString(req.url);
    const paginator = pagination.create(prelink, brands.page, brands.limit, brands.total);
    const paginationData = paginator.getPaginationData();

    res.render('backend/brand/index', {
        title: 'Список брендов',
        data: req.query,
        brands: brands.data,
        counter: paginationData.fromResult,
        paginator: paginator,
        paginationData: paginationData
    }, (err, html) => {
        req.session.flash = [];
        res.send(html);
    });
};

const createView = (req, res, next) => {
    res.render('backend/brand/create', { title: 'Создать новый бренд', data: {}, error: false });
};

const createAction = async (req, res, next) => {
    try {
        const ajv = new Ajv({verbose: true});
        const validBrand = ajv.validate(BrandJsonSchema, req.body);

        if (!validBrand) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const brand = new Brand({
            name: req.body.name
        });

        await brand.save();

        req.flash('success', 'Новый бренд был успешно добавлен.');

        res.redirect('/backend/brand');
    } catch (error) {
        res.render('backend/brand/create', { title: 'Создать новый бренд', data: req.body, error: error.message });
    }
};

const editView = async (req, res, next) => {
    const id = req.params.id;

    try {
        const brand = await Brand.findById(id);

        res.render('backend/brand/edit', { title: 'Редактирование бренда', data: brand, error: false });
    } catch (error) {
        next();
    }
};

const editAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const ajv = new Ajv({verbose: true});
        const validBrand = ajv.validate(BrandJsonSchema, req.body);

        if (!validBrand) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const brand = await Brand.findById(id);

        brand.name = req.body.name;
        await brand.save();

        req.flash('success', 'Бренд был успешно отредактирован.');

        res.redirect('/backend/brand');
    } catch (error) {
        res.render('backend/brand/create', { title: 'Редактирование бренда', data: req.body, error: error.message });
    }
};

const deleteAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const brand = await Brand.findById(id);
        brand.delete();

        req.flash('success', 'Бренд был успешно удален.');

        res.redirect('/backend/brand');
    } catch (error) {
        next();
    }
};

module.exports.indexView = indexView;
module.exports.createView = createView;
module.exports.createAction = createAction;
module.exports.editView = editView;
module.exports.editAction = editAction;
module.exports.deleteAction = deleteAction;