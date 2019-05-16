const appRoot = require('app-root-path');
const path = require('path');

const upload = 'public/uploads';
const sellerImgPath = path.normalize(`${appRoot}/${upload}/sellers/`);

module.exports = {
    path: {
        sellers: {
            logo: sellerImgPath,
            url: `/uploads/sellers/`
        }
    }
};
