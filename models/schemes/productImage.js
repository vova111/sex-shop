const mongoose = require('mongoose');

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
}, {
    _id: false
});