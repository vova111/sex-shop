const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const fs = require('fs-extra');
const productCategorySchema = require('models/schemes/productCategory');
const productImageSchema = require('models/schemes/productImage');
const productImgPath = require('config').get('path:products:photo');
const productImgUrl = require('config').get('path:products:url');
const productThumbImgPath = require('config').get('path:products:thumb:photo');
const productThumbImgUrl = require('config').get('path:products:thumb:url');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    code: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    inStock: {
        type: Schema.Types.Boolean,
        default: true,
        index: true
    },
    slug: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    cost: {
        mainCost: {
            type: Schema.Types.Number,
            default: 0
        },
        discountCost: {
            type: Schema.Types.Number,
            default: null
        },
        isDiscount: {
            type: Schema.Types.Boolean,
            default: false,
            index: true
        },
    },
    description: {
        short: {
            type: Schema.Types.String,
            default: null
        },
        full: {
            type: Schema.Types.String,
            default: null
        },
    },
    specifications: {
        type: Schema.Types.Map,
        of: String,
        default: null
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
        index: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        default: null,
        index: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        default: null,
        index: true
    },
    category: [
        productCategorySchema
    ],
    photos: [
        productImageSchema
    ]
});

productSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

productSchema.virtual('price').get(function () {
    const price = this.cost.discountCost ? this.cost.discountCost : this.cost.mainCost;
    return price / 100;
});

productSchema.statics.getUniqueFilename = function() {
    return `${mongoose.Types.ObjectId()}.jpg`;
};

productSchema.statics.createSpecificationsObject = function(names, values) {
    const object = {};

    if (Array.isArray(names)) {
        for (let i = 0; i < names.length; i++) {
            object[names[i]] = values[i];
        }
    } else {
        return null;
    }

    return object;
};

productSchema.pre('save', async function (next) {
    this.cost.mainCost *= 100;
    this.cost.discountCost = this.cost.discountCost ? this.cost.discountCost * 100 : 0;

    this.cost.isDiscount = !!this.cost.discountCost;

    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;