const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    const userEmail = req.body.email; 
    res.render('login' )
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register'} )
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'That email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: true,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('confirm', 'Confirmed password cannot be blank').notEmpty();
    req.checkBody('confirm', 'Passwords must match. Check these...').equals(req.body.password);
    const errors = req.validationErrors(); 
    if (errors){
        req.flash('error', errors.map( err => err.msg));
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    // No errors
    next();
};

exports.register = async (req, res, next) => {
     const user = new User({name: req.body.name, email: req.body.email })
     const register = promisify(User.register, User)
     await register(user, req.body.password); 
     next();
};


exports.account = (req, res) => {
    res.render('account', { title: 'Edit your account' });
}

exports.postAccount = (req, res) => {
    if (errors) {
        res.render('account', {title: 'Register'});
        return;
    }
    req.flash('success', 'Successfully updated your account')
    res.redirect('account'); 
}