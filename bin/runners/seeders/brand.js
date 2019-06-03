const Brand = require('models/brand');

const init = () => new Promise((resolve, reject) => {
    Brand.countDocuments()
        .then((count) => {
            if (!count) {
                const brands = [
                    {_id: '5cf25c450b71e11a3097b6d1', name: 'Adrien Lastic'},
                    {_id: '5cf25c450b71e11a3097b6d2', name: 'Alive'},
                    {_id: '5cf25c450b71e11a3097b6d3', name: 'Big Teaze Toys'},
                    {_id: '5cf25c450b71e11a3097b6d4', name: 'BKK'},
                    {_id: '5cf25c450b71e11a3097b6d5', name: 'Blow Yo'},
                    {_id: '5cf25c450b71e11a3097b6d6', name: 'You2Toys'},
                    {_id: '5cf25c450b71e11a3097b6d7', name: 'Baile'},
                    {_id: '5cf25c450b71e11a3097b6d8', name: 'Seven Creations'},
                    {_id: '5cf25c450b71e11a3097b6d9', name: 'California Exotic Novelties'},
                    {_id: '5cf25c450b71e11a3097b6da', name: 'Pipedream'},
                    {_id: '5cf25c450b71e11a3097b6db', name: 'Lovetoy'},
                    {_id: '5cf25c450b71e11a3097b6dc', name: 'Vibe Therapy'},
                    {_id: '5cf25c450b71e11a3097b6dd', name: 'Doc Johnson'},
                    {_id: '5cf25c450b71e11a3097b6de', name: 'B-Swish'},
                    {_id: '5cf25c450b71e11a3097b6df', name: 'Tenga'},
                    {_id: '5cf25c450b71e11a3097b6e0', name: 'Close2you'},
                    {_id: '5cf25c450b71e11a3097b6e1', name: 'Love in the Pocket'},
                    {_id: '5cf25c450b71e11a3097b6e2', name: 'PlayHouse'},
                    {_id: '5cf25c450b71e11a3097b6e3', name: 'DOXY'},
                    {_id: '5cf25c450b71e11a3097b6e4', name: 'Femintimate'},
                    {_id: '5cf25c450b71e11a3097b6e5', name: 'FT London LLP'},
                    {_id: '5cf25c450b71e11a3097b6e6', name: 'Happyrabbit'},
                    {_id: '5cf25c450b71e11a3097b6e7', name: 'Je Joue'},
                    {_id: '5cf25c450b71e11a3097b6e8', name: 'JimmyJane'},
                    {_id: '5cf25c450b71e11a3097b6e9', name: 'Kiiroo'},
                    {_id: '5cf25c450b71e11a3097b6ea', name: 'Lovehoney'},
                    {_id: '5cf25c450b71e11a3097b6eb', name: 'Lovense'},
                    {_id: '5cf25c450b71e11a3097b6ec', name: 'Marc Dorcel'},
                    {_id: '5cf25c450b71e11a3097b6ed', name: 'Minna Life'},
                    {_id: '5cf25c450b71e11a3097b6ee', name: 'NS Novelties'},
                    {_id: '5cf25c450b71e11a3097b6ef', name: 'OhMiBod'},
                    {_id: '5cf25c450b71e11a3097b6f0', name: 'Satisfyer'},
                    {_id: '5cf25c450b71e11a3097b6f1', name: 'Tokyo Design'},
                    {_id: '5cf25c450b71e11a3097b6f2', name: 'Wake-Up-Vibe'},
                    {_id: '5cf25c450b71e11a3097b6f3', name: 'Uprize'},
                    {_id: '5cf25c450b71e11a3097b6f4', name: 'SokoLingerie'},
                    {_id: '5cf25c450b71e11a3097b6f5', name: 'Bright&Shiny'},
                    {_id: '5cf25c450b71e11a3097b6f6', name: 'O\'she Lingerie'},
                    {_id: '5cf25c450b71e11a3097b6f7', name: 'Tom of Finland'},
                    {_id: '5cf280fe78d1ad2bb4ff8346', name: 'Fun Factory'},
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