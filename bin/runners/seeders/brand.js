const Brand = require('models/brand');

const init = () => new Promise((resolve, reject) => {
    Brand.countDocuments()
        .then((count) => {
            if (!count) {
                const brands = [
                    {name: 'Adrien Lastic'},
                    {name: 'Alive'},
                    {name: 'Big Teaze Toys'},
                    {name: 'BKK'},
                    {name: 'Blow Yo'},
                    {name: 'You2Toys'},
                    {name: 'Baile'},
                    {name: 'Seven Creations'},
                    {name: 'California Exotic Novelties'},
                    {name: 'Pipedream'},
                    {name: 'Lovetoy'},
                    {name: 'Vibe Therapy'},
                    {name: 'Doc Johnson'},
                    {name: 'B-Swish'},
                    {name: 'Tenga'},
                    {name: 'Close2you'},
                    {name: 'Love in the Pocket'},
                    {name: 'PlayHouse'},
                ];

                return Brand.create(brands);
            } else {
                return false;
            }
        })
        .then((result) => {
            if (!result) {
                console.log('Collection Brand already exists');
            } else {
                console.log('The collection Brand has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;