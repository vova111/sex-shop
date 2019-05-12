const loginJsonSchema = {
    'title': 'Login',
    'description': 'Authorization on the site',
    'type': 'object',
    'properties': {
        'email': {
            'description': 'User E-mail',
            'type': 'string',
            'format': 'email'
        },
        'password': {
            'description': 'User password',
            'type': 'string',
            "minLength": 6
        },
    },
    'required': ['email', 'password']
};

module.exports = loginJsonSchema;