const appRoot = require('app-root-path');
const path = require('path');

const upload = 'public/uploads';
const sellerImgPath = path.normalize(`${appRoot}/${upload}/sellers/`);
const productImgPath = path.normalize(`${appRoot}/${upload}/products/`);
const productThumbImgPath = path.normalize(`${appRoot}/${upload}/products/thumbnails/`);

module.exports = {
    path: {
        sellers: {
            logo: sellerImgPath,
            url: '/uploads/sellers/'
        },
        products: {
            photo: productImgPath,
            url: '/uploads/products/',
            thumb: {
                photo: productThumbImgPath,
                utl: '/uploads/products/thumbnails/'
            }
        }
    }
};