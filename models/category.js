const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginator-simple');
const arrayToTree = require('array-to-tree');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Category',
        default: null
    },
    sort: {
        type: Schema.Types.Number,
        default: 0
    },
    slug: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        unique: true
    },
    productsCount: {
        type: Schema.Types.Number,
        default: 0
    }
});

categorySchema.plugin(mongoosePaginator, {
    maxLimit: 10,
});

categorySchema.virtual('categoryId').get(function () {
    return !this.parent ? null : this.parent.toString();
});

categorySchema.statics.getTreeForMultiSelect = async function (present = []) {
    const categories = await prepareTree();

    const buildGroupSelect = (categories) => {
        let selectHtml = '';

        for (let category of categories) {
            if (typeof(category.children) !== 'undefined' || category.parent === null) {
                selectHtml += `<optgroup label="${category.name}">`;

                if (typeof(category.children) !== 'undefined') {
                    selectHtml += buildGroupSelect(category.children);
                }

                selectHtml += '</optgroup>';
            } else {
                const selected = present.indexOf(category._id) !== -1 ? ' selected' : '';
                selectHtml += `<option value="${category._id}"${selected}>${category.name}</option>`;
            }
        }

        return selectHtml;
    };

    return buildGroupSelect(categories);
};

const prepareTree = async (fields = 'id name parent', where = {}) => {
    const categories = await Category.find(where).select(fields).sort({sort: 1}).lean();
    const json = JSON.stringify(categories);

    return arrayToTree(JSON.parse(json), {
        parentProperty: 'parent',
        customID: '_id'
    });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;