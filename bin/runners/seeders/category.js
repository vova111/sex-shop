const Category = require('models/category');
const mongoose = require('mongoose');
const slugify = require('@sindresorhus/slugify');

const init = () => new Promise((resolve, reject) => {
    Category.countDocuments()
        .then((count) => {
            if (!count) {
                const categories = [{
                    name: 'Секс-игрушки', sort: 5, children: [
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
                    name: 'Белье, костюмы', sort: 10, children: [
                        {name: 'Бюстгальтеры', sort: 5},
                        {name: 'Боди, корсеты', sort: 10},
                        {name: 'Пеньюары', sort: 15},
                        {name: 'Клубная одежда и платья', sort: 20}
                    ]
                }, {
                    name: 'БДСМ, Фетиш', sort: 15, children: [
                        {name: 'Кляпы', sort: 5},
                        {name: 'Маски', sort: 10},
                        {name: 'Наручники', sort: 15},
                        {name: 'Ошейники', sort: 20}
                    ]
                }, {
                    name: 'Лубриканты', sort: 20, children: [
                        {name: 'Анальные лубриканты (смазки)', sort: 5},
                        {name: 'Вагинальные лубриканты (смазки)', sort: 10},
                        {name: 'Оральные лубриканты (подсластители)', sort: 15},
                    ]
                }, {
                    name: 'Прелюдия', sort: 25, children: [
                        {name: 'Эротический массаж', sort: 5},
                        {name: 'Ролевые игры', sort: 10},
                        {name: 'Романтика', sort: 15},
                    ]
                }, {
                    name: 'Сексуальное здоровье', sort: 30, children: [
                        {name: 'Натуральные препараты для женщин', sort: 5},
                        {name: 'Натуральные препараты для мужчин', sort: 10},
                        {name: 'Биодобавки', sort: 15},
                    ]
                }, {
                    name: 'Подарки', sort: 35, children: [
                        {name: 'Чашки', sort: 5},
                        {name: 'Фартуки', sort: 10},
                        {name: 'Игровые карты', sort: 15},
                    ]
                }, {
                    name: 'Девушкам', sort: 40, children: [
                        {name: 'Уход за телом', sort: 5},
                        {name: 'Игрушки для ванной', sort: 10},
                        {name: 'Духи с феромонами', sort: 15},
                        {name: 'Увеличение груди', sort: 20}
                    ]
                }, {
                    name: 'Для пары', sort: 45, children: [
                        {name: 'Страпоны-вибраторы', sort: 5},
                        {name: 'Наборы для удовольствия', sort: 10},
                        {name: 'Секс-мебель', sort: 15},
                        {name: 'Важные мелочи', sort: 20}
                    ]
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

        if (typeof object.children !== 'undefined') {
            array = array.concat(generateCategoryArray(object.children, id));
        }
    }

    return array;
};

module.exports = init;