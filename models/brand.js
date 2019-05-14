const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    }
});

brandSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;