const passport = require('passport');

exports.login = passport.authenticate( 'local', {
        failureRedirect: '/login',
        failureFlash: 'Oops! Incorrect details',
        successRedirect: '/',
        successFlash: 'You are now logged in'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    // Use Passport to tell if Authenticated...
    if(req.isAuthenticated()){
        next();
        return;
    }
    req.flash('error', 'Please log in before adding a store!');
    res.redirect('/login');
}
