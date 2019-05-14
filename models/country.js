const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    }
});

countrySchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;