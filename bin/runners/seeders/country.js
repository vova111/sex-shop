// Подключаем модель Country
const Country = require('models/country');

const init = () => new Promise((resolve, reject) => {
    // Просим БД, чтобы она нам вернула общее количество Документов в
    // Коллекции Country
    // Источник: https://mongoosejs.com/docs/api.html#model_Model.countDocuments
    Country.countDocuments()
        // Когда БД подсчитает количество документов, их количество она
        // запишет в переменную count
        .then((count) => {
            // Проеряем, если в базе данных ничего нету, тогда Коллекцию Country заполним некоторыми значениями
            if (!count) {
                // Заполняем массив объктами из стран
                const countries = [
                    {name: 'Австралия'},
                    {name: 'Аргентина'},
                    {name: 'Бельгия'},
                    {name: 'Бразилия'},
                    {name: 'Великобритания'},
                    {name: 'Вьетнам'},
                    {name: 'Германия'},
                    {name: 'Ирландия'},
                    {name: 'Италия'},
                    {name: 'Китай'},
                    {name: 'США'},
                    {name: 'Турция'},
                    {name: 'Япония'}
                ];

                // Записываем значение в базу данных и передаем результат в следующий then
                // Источник: https://mongoosejs.com/docs/api.html#model_Model.create
                return Country.create(countries);
            } else {
                // Если в Коллекции Country уже что-то есть, тогда ничего не делаем
                return false;
            }
        })
        .then((result) => {
            if (!result) {
                console.log('Collection Country already exists');
            } else {
                console.log('The collection Country has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;