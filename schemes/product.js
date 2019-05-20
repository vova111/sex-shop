const productJsonSchema = {
    'title': 'Товар',
    'description': 'Товар',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'Название товара',
            'type': 'string',
            'minLength': 7,
            'maxLength': 200
        },
        'code': {
            'description': 'Код товара',
            'type': 'string',
            'minLength': 8,
            'maxLength': 8,
            'pattern': "^\\d{8}$"
        },
        'cost': {
            'description': 'Цена товара',
            'type': 'string',
            'minLength': 1,
            'maxLength': 8,
            'pattern': "^(\\d+\\.\\d{1,2})$"
        },
        'category': {
            'description': 'Категория товара',
            'type': 'array',
            'contains': {
                'type': 'string',
                'minLength': 1,
            },
            'minItems': 1,
            'uniqueItems': true
        },
        'seller': {
            'description': 'Продацев',
            'type': 'string',
        },
        'brand': {
            'description': 'Бренд',
            'type': 'string',
        },
        'country': {
            'description': 'Страна производитель',
            'type': 'string',
        },
        'slug': {
            'description': 'Постоянная ссылка',
            'type': 'string',
            'minLength': 3,
            'maxLength': 200,
            'pattern': "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        'stock': {
            'description': 'Товар есть на складе',
            'type': 'string',
            'enum': ['on']
        },
        'short': {
            'description': 'Короткое описание товара',
            'type': 'string',
        },
        'full': {
            'description': 'Полное описание товара',
            'type': 'string',
        },
        'specification_name': {
            'type': 'array',
            'contains': {
                'type': 'string',
                'minLength': 1,
            },
            'minItems': 1
        },
        'specification_value': {
            'type': 'array',
            'contains': {
                'type': 'string',
                'minLength': 1,
            },
            'minItems': 1
        },
        'image_main': {
            'type': 'array',
            'contains': {
                'type': 'string',
                'minLength': 1,
                'enum': ['0', '1']
            },
            'minItems': 1
        }
    },
    "if": {
        'properties': {
            "discount": {
                'description': 'Скидочная цена товара',
                'type': 'string',
                'minLength': 1,
                'maxLength': 8
            }
        }
    },
    "then": {
        'properties': {
            "discount": {
                'description': 'Скидочная цена товара',
                'pattern': "^(\\d+\\.\\d{1,2})$"
            }
        }
    },
    'required': ['name', 'code', 'cost', 'category', 'slug']
};

module.exports = productJsonSchema;