const categoryJsonSchema = {
    'title': 'Категория',
    'description': 'Категория товара',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'Название категории',
            'type': 'string',
            'minLength': 3,
            'maxLength': 40
        },
        'countryId': {
            'description': 'Родительская категория',
            'type': 'string',
            'minLength': 1
        },
        'slug': {
            'description': 'Постоянная ссылка',
            'type': 'string',
            'minLength': 3,
            'maxLength': 40,
            'pattern': "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        'sort': {
            'description': 'Сортирока',
            'type': 'integer',
            'minimum': 0,
            'maximum': 99999
        }
    },
    'required': ['name', 'slug', 'sort']
};

module.exports = categoryJsonSchema;