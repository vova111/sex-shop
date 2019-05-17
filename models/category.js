const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const arrayToTree = require('array-to-tree');

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

categorySchema.statics.getTreeForMultiSelect = async function (present = null) {
    const categories = await prepareTree();
    console.log(categories);
};

const prepareTree = async () => {
    const categories = await Category.find({}).sort({sort: -1});

    var dataTwo = [
        {
            _id: 'ec654ec1-7f8f-11e3-ae96-b385f4bc450c',
            name: 'Portfolio',
            parent: null
        },
        {
            _id: 'ec666030-7f8f-11e3-ae96-0123456789ab',
            name: 'Web Development',
            parent: 'ec654ec1-7f8f-11e3-ae96-b385f4bc450c'
        },
        {
            _id: 'ec66fc70-7f8f-11e3-ae96-000000000000',
            name: 'Recent Works',
            parent: 'ec666030-7f8f-11e3-ae96-0123456789ab'
        },
        {
            _id: '32a4fbed-676d-47f9-a321-cb2f267e2918',
            name: 'About Me',
            parent: null
        }
    ];

    return arrayToTree(dataTwo, {
        parentProperty: 'parent',
        customID: '_id'
    });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;