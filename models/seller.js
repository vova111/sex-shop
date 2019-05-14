const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    logo: {
        type: Schema.Types.String,
        default: null
    }
});

sellerSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;