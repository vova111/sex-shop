const mongoose = require('mongoose');
const productImgUrl = require('config').get('path:products:url');
const productThumbImgUrl = require('config').get('path:products:thumb:url');

const Schema = mongoose.Schema;

const productImageSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    isMain: {
        type: Schema.Types.Boolean,
        default: false
    }
});

productImageSchema.virtual('thumbUrl').get(function () {
    return `${productThumbImgUrl}${this.name}`;
});

module.exports = productImageSchema;