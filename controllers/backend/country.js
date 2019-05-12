const Country = require('models/country');
const CountryJsonSchema = require('schemes/country');
const Ajv = require('ajv/lib/ajv');
const pagination = require('classes/boostrapPaginator');
const queryStringBuilder = require('classes/queryStringBuilder');

const indexView = async (req, res, next) => {
    const page = typeof req.query.page === 'undefined' ? 1 : Number(req.query.page);
    const sort = {_id: 'DESC'};

    const whereCountry = typeof req.query.name === 'undefined'
        ? {}
        : {'name': { '$regex': req.query.name, '$options': 'i' }};

    const countries = await Country.paginate(whereCountry, {sort: sort, page: page});

    const prelink = '/backend/country' + queryStringBuilder.buildString(req.url);
    const paginator = pagination.create(prelink, countries.page, countries.limit, countries.total);
    const paginationData = paginator.getPaginationData();

    res.render('backend/country/index', {
        title: 'Список стран',
        data: req.query,
        countries: countries.data,
        counter: paginationData.fromResult,
        paginator: paginator,
        paginationData: paginationData
    });
};

const createView = (req, res, next) => {
    res.render('backend/country/create', { title: 'Создать новую страну', data: {}, error: false });
};

const createAction = async (req, res, next) => {
    try {
        const ajv = new Ajv({verbose: true});
        const validCountry = ajv.validate(CountryJsonSchema, req.body);

        if (!validCountry) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const country = new Country({
            name: req.body.name
        });

        await country.save();

        res.redirect('/backend/country');
    } catch (error) {
        res.render('backend/country/create', { title: 'Создать новую страну', data: req.body, error: error.message });
    }
};

const editView = async (req, res, next) => {
    const id = req.params.id;

    try {
        const country = await Country.findById(id);

        res.render('backend/country/edit', { title: 'Редактирование страны', data: country, error: false });
    } catch (error) {
      next();
    }
};

const editAction = async (req, res, next) => {
    const id = req.params.id;

    try {
        const ajv = new Ajv({verbose: true});
        const validCountry = ajv.validate(CountryJsonSchema, req.body);

        if (!validCountry) {
            const message = `${ajv.errors[0].parentSchema.description} ${ajv.errors[0].message}`;
            throw new Error(message);
        }

        const country = await Country.findById(id);

        country.name = req.body.name;
        await country.save();

        req.flash('success', 'Страна была успешно отредактирована.');

        res.redirect('/backend/country');
    } catch (error) {
        res.render('backend/country/create', { title: 'Создать новую страну', data: req.body, error: error.message });
    }
};

module.exports.indexView = indexView;
module.exports.createView = createView;
module.exports.createAction = createAction;
module.exports.editView = editView;
module.exports.editAction = editAction;