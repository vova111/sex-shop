const homeView = async (req, res, next) => {
    res.render('backend/home/dashboard', { title: 'Административная панель' });
};

module.exports.homeView = homeView;