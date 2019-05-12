const countryJsonSchema = {
    'title': 'Страна',
    'description': 'Страна производитель товара',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'Страна',
            'type': 'string',
            "minLength": 3,
            "maxLength": 40
        }
    },
    'required': ['name']
};

module.exports = countryJsonSchema;