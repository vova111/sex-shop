const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    }
}, {
    _id: false
});