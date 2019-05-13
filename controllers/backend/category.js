const Category = require('models/category');
const CategoryJsonSchema = require('schemes/category');
const Ajv = require('ajv/lib/ajv');
const pagination = require('classes/boostrapPaginator');
const queryStringBuilder = require('classes/queryStringBuilder');

const indexView = async (req, res, next) => {
    const page = typeof req.query.page === 'undefined' ? 1 : Number(req.query.page);
    const sort = {_id: 'DESC'};

    const whereCategory = typeof req.query.name === 'undefined'
        ? {}
        : {'name': { '$regex': req.query.name, '$options': 'i' }};

    const whereMainCategory = typeof req.query.categoryId === 'undefined' || !req.query.categoryId.length
        ? {}
        : {'parent': req.query.categoryId};

    const where = Object.assign(whereCategory, whereMainCategory);

    const categories = await Category.paginate(where, {populate: {path: 'parent'}, sort: sort, page: page});
    const mainCategories = await Category.find({parent: null}).sort({sort: 1});

    const prelink = '/backend/category' + queryStringBuilder.buildString(req.url);
    const paginator = pagination.create(prelink, categories.page, categories.limit, categories.total);
    const paginationData = paginator.getPaginationData();

    res.render('backend/category/index', {
        title: 'Список категорий',
        data: req.query,
        categories: categories.data,
        mainCategories: mainCategories,
        counter: paginationData.fromResult,
        paginator: paginator,
        paginationData: paginationData
    }, (err, html) => {
        req.session.flash = [];
        res.send(html);
    });
};

const createView = async (req, res, next) => {
    const categories = await Category.find({parent: null}).sort({sort: 1});

    res.render('backend/category/create', { title: 'Создать новую категорию', data: {}, categories: categories, error: false });
};

const createAction = async (req, res, next) => {
    const { name, categoryId, slug, sort } = req.body;
    const categoryObj = { name, categoryId, slug, sort: Number(sort) };

    try {
        const ajv = new Ajv({verbose: true});
        const validCategory = ajv.validate(CategoryJsonSchema, categoryObj);

        if (!validCategory) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const category = new Category({
            name: name,
            parent: !categoryId.length ? null : categoryId,
            sort: sort,
            slug: slug
        });

        await category.save();

        req.flash('success', 'Новая категория была успешно добавлена.');

        res.redirect('/backend/category');
    } catch (error) {
        const categories = await Category.find({parent: null}).sort({sort: 1});
        res.render('backend/category/create', { title: 'Создать новую категорию', data: req.body, categories: categories, error: error.message });
    }
};

const editView = async (req, res, next) => {
    const id = req.params.id;

    try {
        const category = await Category.findById(id);
        const categories = await Category.find({parent: null}).sort({sort: 1});

        res.render('backend/category/edit', { title: 'Редактирование категории', data: category, categories: categories, error: false });
    } catch (error) {
        next();
    }
};

const editAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const ajv = new Ajv({verbose: true});
        const validBrand = ajv.validate(CategoryJsonSchema, req.body);

        if (!validBrand) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const brand = await Category.findById(id);

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
        const brand = await Category.findById(id);
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