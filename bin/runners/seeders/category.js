const Category = require('models/category');
const mongoose = require('mongoose');
const slugify = require('@sindresorhus/slugify');

const init = () => new Promise((resolve, reject) => {
    Category.countDocuments()
        .then((count) => {
            if (!count) {
                const categories = [{
                    id: '5cf252ee71d7cd1ca4d202f9', name: 'Секс-игрушки', sort: 5, children: [
                        {id: '5cf252ee71d7cd1ca4d202fa', name: 'Вибраторы', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d202fb', name: 'Фаллоимитаторы', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d202fc', name: 'Анальные игрушки', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d202fd', name: 'Пульсаторы', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d202fe', name: 'Вагины и мастурбаторы', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d202ff', name: 'Массажеры простаты', sort: 30},
                        {id: '5cf252ee71d7cd1ca4d20300', name: 'Кольца и насадки', sort: 35},
                        {id: '5cf252ee71d7cd1ca4d20301', name: 'Вагинальные шарики', sort: 40},
                        {id: '5cf252ee71d7cd1ca4d20302', name: 'Вакуумные помпы, гидропомпы', sort: 45},
                        {id: '5cf252ee71d7cd1ca4d20303', name: 'Вакуумные стимуляторы', sort: 50},
                        {id: '5cf252ee71d7cd1ca4d20304', name: 'Секс-куклы', sort: 55},
                        {id: '5cf252ee71d7cd1ca4d20305', name: 'Секс-игры', sort: 60},
                        {id: '5cf252ee71d7cd1ca4d20306', name: 'Мешочки и боксы для хранения', sort: 65},
                        {id: '5cf252ee71d7cd1ca4d20307', name: 'Тренажеры Кегеля', sort: 70}
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20308', name: 'Белье, костюмы', sort: 10, children: [
                        {id: '5cf252ee71d7cd1ca4d20309', name: 'Бюстгальтеры', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d2030a', name: 'Боди, корсеты', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d2030b', name: 'Пеньюары', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d2030c', name: 'Мужское белье', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d2030d', name: 'Трусики', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d2030e', name: 'Бэби-долл', sort: 30},
                        {id: '5cf252ee71d7cd1ca4d2030f', name: 'Игровые костюмы', sort: 35},
                        {id: '5cf252ee71d7cd1ca4d20310', name: 'Комбинезоны', sort: 40},
                        {id: '5cf252ee71d7cd1ca4d20311', name: 'Комплекты', sort: 45},
                        {id: '5cf252ee71d7cd1ca4d20312', name: 'Корсеты', sort: 50},
                        {id: '5cf252ee71d7cd1ca4d20313', name: 'Пояса для чулок', sort: 55},
                        {id: '5cf252ee71d7cd1ca4d20314', name: 'Колготки и леггинсы', sort: 60},
                        {id: '5cf252ee71d7cd1ca4d20315', name: 'Новогодние комплекты', sort: 65}
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20316', name: 'БДСМ, Фетиш', sort: 15, children: [
                        {id: '5cf252ee71d7cd1ca4d20317', name: 'Кляпы', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d20318', name: 'Маски и повязки на глаза', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d20319', name: 'Наручники', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d2031a', name: 'Плети и флоггеры', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d2031b', name: 'Электростимуляторы', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d2031c', name: 'Пояса верности', sort: 30},
                        {id: '5cf252ee71d7cd1ca4d2031d', name: 'Метелочки', sort: 35},
                        {id: '5cf252ee71d7cd1ca4d2031e', name: 'Уретральные вставки', sort: 40},
                        {id: '5cf252ee71d7cd1ca4d2031f', name: 'Портупеи', sort: 45},
                        {id: '5cf252ee71d7cd1ca4d20320', name: 'Чокеры', sort: 50},
                        {id: '5cf252ee71d7cd1ca4d20321', name: 'Латексная одежда', sort: 55},
                        {id: '5cf252ee71d7cd1ca4d20322', name: 'Колесо Вартенберга', sort: 60},
                        {id: '5cf252ee71d7cd1ca4d20323', name: 'Свечи для игр', sort: 65}
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20324', name: 'Лубриканты', sort: 20, children: [
                        {id: '5cf252ee71d7cd1ca4d20325', name: 'Анальные лубриканты (смазки)', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d20326', name: 'Вагинальные лубриканты (смазки)', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d20327', name: 'Оральные лубриканты (подсластители)', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d20328', name: 'Возбуждающие средства', sort: 20}
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20329', name: 'Прелюдия', sort: 25, children: [
                        {id: '5cf252ee71d7cd1ca4d2032a', name: 'Эротический массаж', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d2032b', name: 'Ролевые игры', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d2032c', name: 'Романтика', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d2032d', name: 'Масла для массажа', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d2032e', name: 'Массажные крема', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d2032f', name: 'Массажные свечи', sort: 30},
                        {id: '5cf252ee71d7cd1ca4d20330', name: 'Боди-арт', sort: 35},
                        {id: '5cf252ee71d7cd1ca4d20331', name: 'Духи с феромонами', sort: 40},
                        {id: '5cf252ee71d7cd1ca4d20332', name: 'Пролонгаторы (продление полового акта)', sort: 45},
                        {id: '5cf252ee71d7cd1ca4d20333', name: 'Жидкие выбраторы', sort: 50},
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20334', name: 'Сексуальное здоровье', sort: 30, children: [
                        {id: '5cf252ee71d7cd1ca4d20335', name: 'Вагинальные шарики', sort: 5, slug: 'vaginalnye-shariki-zdorove'},
                        {id: '5cf252ee71d7cd1ca4d20336', name: 'Массажеры простаты', sort: 10, slug: 'massazhery-prostaty-zdorove'},
                        {id: '5cf252ee71d7cd1ca4d20337', name: 'Биодобавки', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d20338', name: 'Менструальные чаши', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d20339', name: 'Антисептики, средства по уходу и очистке', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d2033a', name: 'Вакуумные помпы и гидропомпы', sort: 30}
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d2033b', name: 'Подарки', sort: 35, children: [
                        {id: '5cf252ee71d7cd1ca4d2033c', name: 'День Св. Валентина (14 февраля)', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d2033d', name: 'Подарочные сертификаты', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d2033e', name: 'Книги, календари, открытки и другое', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d2033f', name: 'Игровые карты', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d20340', name: 'Шоколадные и карамельные пенисы, грудь', sort: 25},
                        {id: '5cf252ee71d7cd1ca4d20341', name: 'Сумки, футболки, рюкзаки', sort: 30},
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d20342', name: 'Девушкам', sort: 40, children: [
                        {id: '5cf252ee71d7cd1ca4d20343', name: 'Вибраторы', sort: 5, slug: 'vibratory-devushkam'},
                        {id: '5cf252ee71d7cd1ca4d20344', name: 'Игрушки для ванной', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d20345', name: 'Духи с феромонами', sort: 15, slug: 'duhi-s-feromonami-devushkam'},
                        {id: '5cf252ee71d7cd1ca4d20346', name: 'Увеличение груди', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d20347', name: 'Пульсаторы', sort: 25, slug: 'pulsatory-devushkam'},
                        {id: '5cf252ee71d7cd1ca4d20348', name: 'Страпоны', sort: 30},
                        {id: '5cf252ee71d7cd1ca4d20349', name: 'Вакуумные помпы', sort: 35},
                        {id: '5cf252ee71d7cd1ca4d2034a', name: 'Возбуждающие средства', sort: 40, slug: 'vozbuzhdayushchie-sredstva-devushkam'},
                    ]
                }, {
                    id: '5cf252ee71d7cd1ca4d2034b', name: 'Для пары', sort: 45, children: [
                        {id: '5cf252ee71d7cd1ca4d2034c', name: 'Страпоны-вибраторы', sort: 5},
                        {id: '5cf252ee71d7cd1ca4d2034d', name: 'Наборы для удовольствия', sort: 10},
                        {id: '5cf252ee71d7cd1ca4d2034e', name: 'Секс-мебель', sort: 15},
                        {id: '5cf252ee71d7cd1ca4d2034f', name: 'Важные мелочи', sort: 20},
                        {id: '5cf252ee71d7cd1ca4d20350', name: 'Массажные средства', sort: 25}
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
        const id = typeof object.id === 'undefined' ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(object.id);
        const slug = typeof object.slug === 'undefined' ? slugify(object.name) : object.slug;

        array.push({ _id: id, name: object.name, sort: object.sort, parent: parent, slug: slug });

        if (typeof object.children !== 'undefined') {
            array = array.concat(generateCategoryArray(object.children, id));
        }
    }

    return array;
};

module.exports = init;