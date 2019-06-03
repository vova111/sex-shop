const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    class: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    sort: {
        type: Schema.Types.Number,
        required: true
    }
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;