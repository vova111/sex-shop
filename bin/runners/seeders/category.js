const Category = require('models/category');
const mongoose = require('mongoose');
const slugify = require('@sindresorhus/slugify');

const init = () => new Promise((resolve, reject) => {
    Category.countDocuments()
        .then((count) => {
            if (!count) {
                const categories = [{
                    name: 'Секс-игрушки', sort: 5, childs: [
                        {name: 'Вибраторы', sort: 5},
                        {name: 'Фаллоимитаторы', sort: 10},
                        {name: 'Анальные игрушки', sort: 15},
                        {name: 'Пульсаторы', sort: 20},
                        {name: 'Вагины и мастурбаторы', sort: 25},
                        {name: 'Массажеры простаты', sort: 30},
                        {name: 'Кольца и насадки', sort: 35},
                        {name: 'Вагинальные шарики', sort: 40},
                        {name: 'Вакуумные помпы, гидропомпы', sort: 45}
                    ]
                }, {
                    name: 'Белье, костюмы', sort: 10
                }, {
                    name: 'БДСМ, Фетиш', sort: 15
                }, {
                    name: 'Лубриканты', sort: 20
                }, {
                    name: 'Прелюдия', sort: 25
                }, {
                    name: 'Сексуальное здоровье', sort: 30
                }, {
                    name: 'Подарки', sort: 35
                }, {
                    name: 'Девушкам', sort: 40
                }, {
                    name: 'Для пары', sort: 45
                }];

                return Category.create(generateCategoryArray(categories));
            } else {
                return false;
            }
        })
        .then((result) => {
            if (!result) {
                console.log('Collection Category already exists');
            } else {
                console.log('The collection Category has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

const generateCategoryArray = (data, parent = null) => {
    let array = [];

    for (let object of data) {
        const id = mongoose.Types.ObjectId();

        array.push({ _id: id, name: object.name, sort: object.sort, parent: parent, slug: slugify(object.name) });

        if (typeof object.childs !== 'undefined') {
            array = array.concat(generateCategoryArray(object.childs, id));
        }
    }

    return array;
};

module.exports = init;