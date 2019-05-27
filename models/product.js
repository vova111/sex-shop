const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const fs = require('fs-extra');
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
        ref: 'Country',
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
        Schema.Types.ObjectId
    ],
    photos: {
        type: [productImageSchema]
    }
}, {
    timestamps: true
});

productSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

productSchema.virtual('price').get(function () {
    const price = this.cost.discountCost ? this.cost.discountCost : this.cost.mainCost;

    return price / 100;
});

productSchema.virtual('formattedPrice').get(function () {
    const cost = this.cost.discountCost ? this.cost.discountCost : this.cost.mainCost;
    const price = cost / 100;

    return price.toFixed(2);
});

productSchema.virtual('formattedCost').get(function () {
    return (this.cost.mainCost / 100).toFixed(2);
});

productSchema.virtual('formattedDiscount').get(function () {
    return this.cost.discountCost ? (this.cost.discountCost / 100).toFixed(2) : null;
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

productSchema.statics.setNewMainImage = async function(imageId, productId) {
    await Product.clearMainImage(productId);

    return Product.updateOne(
        {_id: productId, 'photos._id': imageId},
        {$set: { "photos.$.isMain" : true}}
    ).exec();
};

productSchema.statics.clearMainImage = async function(productId) {
    return Product.updateOne(
        {_id: productId},
        {'$set': {
                'photos.$[].isMain': false
            }
        }).exec();
};

productSchema.statics.removeImage = async function(imageId, productId) {
    const product = await Product.findById(productId);

    for (let i = 0; i < product.photos.length; i++) {
        if (product.photos[i].id === imageId) {
            await fs.remove(`${productImgPath}${product.photos[i].name}`);
            await fs.remove(`${productThumbImgPath}${product.photos[i].name}`);
            break;
        }
    }

    return Product.findByIdAndUpdate(productId, {
        $pull: {
            photos: { _id: imageId }
        }
    }).exec();
};

productSchema.statics.getObjectId = function() {
    return mongoose.Types.ObjectId();
};

productSchema.pre('save', async function (next) {
    this.cost.mainCost *= 100;
    this.cost.discountCost = this.cost.discountCost ? this.cost.discountCost * 100 : 0;

    this.cost.isDiscount = !!this.cost.discountCost;

    // if (this.isModified('category')) {
    //     console.log('modif', this.category, Category);
    //
    // }

    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;