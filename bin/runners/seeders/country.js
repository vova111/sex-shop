const Country = require('models/country');

const init = () => new Promise((resolve, reject) => {
    Country.countDocuments()
        .then((count) => {
            if (!count) {
                const countries = [
                    {_id: '5cf25fd6a6ac3221c0565200', name: 'Австралия'},
                    {_id: '5cf25fd6a6ac3221c0565201', name: 'Аргентина'},
                    {_id: '5cf25fd6a6ac3221c0565203', name: 'Ангола'},
                    {_id: '5cf25fd6a6ac3221c0565205', name: 'Австрия'},
                    {_id: '5cf25fd6a6ac3221c0565204', name: 'Бахрейн'},
                    {_id: '5cf25fd6a6ac3221c0565202', name: 'Белиз'},
                    {_id: '5cf25fd6a6ac3221c0565208', name: 'Бельгия'},
                    {_id: '5cf25fd6a6ac3221c056520a', name: 'Болгария'},
                    {_id: '5cf25fd6a6ac3221c0565206', name: 'Боливия'},
                    {_id: '5cf25fd6a6ac3221c0565209', name: 'Бразилия'},
                    {_id: '5cf25fd6a6ac3221c0565207', name: 'Великобритания'},
                    {_id: '5cf25fd6a6ac3221c056520d', name: 'Венгрия'},
                    {_id: '5cf25fd6a6ac3221c056520b', name: 'Венесуэла'},
                    {_id: '5cf25fd6a6ac3221c056520e', name: 'Вьетнам'},
                    {_id: '5cf25fd6a6ac3221c056520f', name: 'Гаити'},
                    {_id: '5cf25fd6a6ac3221c0565212', name: 'Гана'},
                    {_id: '5cf25fd6a6ac3221c0565210', name: 'Гватемала'},
                    {_id: '5cf25fd6a6ac3221c0565213', name: 'Гондурас'},
                    {_id: '5cf25fd6a6ac3221c056520c', name: 'Грузия'},
                    {_id: '5cf25fd6a6ac3221c0565214', name: 'Германия'},
                    {_id: '5cf25fd6a6ac3221c0565217', name: 'Израиль'},
                    {_id: '5cf25fd7a6ac3221c0565218', name: 'Индия'},
                    {_id: '5cf25fd6a6ac3221c0565215', name: 'Ирак'},
                    {_id: '5cf25fd6a6ac3221c0565211', name: 'Испания'},
                    {_id: '5cf25fd7a6ac3221c0565219', name: 'Ирландия'},
                    {_id: '5cf25fd7a6ac3221c056521d', name: 'Италия'},
                    {_id: '5cf25fd7a6ac3221c056521a', name: 'Канада'},
                    {_id: '5cf25fd7a6ac3221c056521c', name: 'Киргизия'},
                    {_id: '5cf25fd6a6ac3221c0565216', name: 'Колумбия'},
                    {_id: '5cf25fd7a6ac3221c056521e', name: 'Китай'},
                    {_id: '5cf25fd7a6ac3221c0565222', name: 'Латвия'},
                    {_id: '5cf25fd7a6ac3221c056521f', name: 'Литва'},
                    {_id: '5cf25fd7a6ac3221c056521b', name: 'Люксембург'},
                    {_id: '5cf25fd7a6ac3221c0565221', name: 'США'},
                    {_id: '5cf25fd7a6ac3221c0565223', name: 'Турция'},
                    {_id: '5cf25fd7a6ac3221c0565224', name: 'Эстония'},
                    {_id: '5cf25fd7a6ac3221c0565220', name: 'Эфиопия'},
                    {_id: '5cf25fd7a6ac3221c0565226', name: 'Эквадор'},
                    {_id: '5cf25fd7a6ac3221c0565225', name: 'Япония'}
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