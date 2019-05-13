const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

brandSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;