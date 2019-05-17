const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const fs = require('fs-extra');
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

sellerSchema.statics.getUniqueFilename = function() {
    return `${mongoose.Types.ObjectId()}.jpg`;
};

sellerSchema.pre('save', async function (next) {
    if (this.isModified('logo')) {
        if (this._previousLogo) {
            await fs.remove(`${sellerImgPath}${this._previousLogo}`);
        }
    }

    next();
});

sellerSchema.pre('remove', async function (next) {
    if (this.logo) {
        await fs.remove(`${sellerImgPath}${this.logo}`);
    }

    next();
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;