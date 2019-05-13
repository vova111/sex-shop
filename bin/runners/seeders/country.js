const Country = require('models/country');

const init = () => new Promise((resolve, reject) => {
    Country.countDocuments()
        .then((count) => {
            if (!count) {
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

                return Country.create(countries);
            } else {
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