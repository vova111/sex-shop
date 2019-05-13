const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
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
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    productsCount: {
        type: Number,
        default: 0
    }
});

categorySchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

categorySchema.virtual('categoryId').get(function () {
    return this.parent ? this.parent.id : null;
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;