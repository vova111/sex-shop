const sellerJsonSchema = {
    'title': 'Продавец',
    'description': 'Продавец товара на сайте',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'Название продавца',
            'type': 'string',
            'minLength': 3,
            'maxLength': 100
        },
        'slug': {
            'description': 'Постоянная ссылка',
            'type': 'string',
            'minLength': 3,
            'maxLength': 100,
            'pattern': "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        }
    },
    'required': ['name', 'slug']
};

module.exports = sellerJsonSchema;