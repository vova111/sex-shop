const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const sellerImgPath = require('config').get('path:sellers:logo');
const sellerImgUrl = require('config').get('path:sellers:url');

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
        default: null,
        set: function (logo) {
            this._previousLogo = this.logo;
            return logo;
        }
    }
});

sellerSchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

sellerSchema.virtual('logoUrl').get(function () {
    return this.logo ? `${sellerImgUrl}${this.logo}` : null;
});

sellerSchema.pre('save', function (next) {
    if (this.isModified('logo')) {
        console.log('change');
    }

    next();
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;