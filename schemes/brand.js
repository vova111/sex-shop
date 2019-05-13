const brandJsonSchema = {
    'title': 'Бренд',
    'description': 'Фирма производитель товара',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'Бренд',
            'type': 'string',
            "minLength": 3,
            "maxLength": 40
        }
    },
    'required': ['name']
};

module.exports = brandJsonSchema;