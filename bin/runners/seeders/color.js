const Color = require('models/color');

const init = () => new Promise((resolve, reject) => {
    Color.countDocuments()
        .then((count) => {
            if (!count) {
                const colors = [
                    {_id: '5cf26ce6e41add3ba85def71', name: 'Черный', class: 'product-color-black', sort: 5},
                    {_id: '5cf26ce6e41add3ba85def72', name: 'Белый', class: 'product-color-white', sort: 10},
                    {_id: '5cf26ce6e41add3ba85def73', name: 'Красный', class: 'product-color-red', sort: 15},
                    {_id: '5cf26ce6e41add3ba85def77', name: 'Синий', class: 'product-color-blue', sort: 20},
                    {_id: '5cf26ce6e41add3ba85def75', name: 'Бежевый', class: 'product-color-beige', sort: 25},
                    {_id: '5cf26ce6e41add3ba85def76', name: 'Голубой', class: 'product-color-deep-sky-blue', sort: 30},
                    {_id: '5cf26ce6e41add3ba85def74', name: 'Розовый', class: 'product-color-pink', sort: 35},
                    {_id: '5cf26ce6e41add3ba85def78', name: 'Жёлтый', class: 'product-color-yellow', sort: 40},
                    {_id: '5cf26ce6e41add3ba85def7c', name: 'Коричневый', class: 'product-color-brown', sort: 45},
                    {_id: '5cf26ce6e41add3ba85def79', name: 'Серый', class: 'product-color-gray', sort: 50},
                    {_id: '5cf26ce6e41add3ba85def7b', name: 'Золотой', class: 'product-color-gold', sort: 55},
                    {_id: '5cf26ce6e41add3ba85def7a', name: 'Зелёный', class: 'product-color-green', sort: 60},
                    {_id: '5cf26ce6e41add3ba85def7d', name: 'Хаки', class: 'product-color-camouflage-green', sort: 65},
                    {_id: '5cf26ce6e41add3ba85def7f', name: 'Сиреневый', class: 'product-color-lilac', sort: 70},
                    {_id: '5cf26ce6e41add3ba85def80', name: 'Лайм', class: 'product-color-lime', sort: 75},
                    {_id: '5cf26ce6e41add3ba85def7e', name: 'Фиолетовый', class: 'product-color-purple', sort: 80},
                ];

                return Color.create(colors);
            } else {
                return false;
            }
        })
        .then((result) => {
            if (!result) {
                console.log('Collection Color already exists');
            } else {
                console.log('The collection Color has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;