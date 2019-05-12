const express = require('express');
const router = express.Router();
const homeController = require('controllers/backend/home');
const authController = require('controllers/backend/auth');
const placesController = require('controllers/places');

router.get('/', function(req, res, next) {
    res.redirect('/backend/home');
});

router.get('/home', homeController.homeView);

router.get('/login', authController.loginView);
router.post('/login', authController.loginAction);

router.get('/register', authController.registerView);
router.post('/register', authController.registerAction);

router.get('/places', placesController.placesView);
router.post('/getPlacesFromGoogle', placesController.getAddressesFromGooglePlaces);
router.post('/setMyAddressFromGooglePlaces', placesController.setMyAddressFromGooglePlaces);

// router.get('/profile', pagesController.profileView);
// router.post('/profile', pagesController.profileAction);

router.get('/password', function(req, res, next) {
    res.render('password', { title: 'Change password' });
});

// router.get('/users', authController.onlyAdmin, pagesController.userView);

router.get('/logout', authController.logout);

module.exports = router;
