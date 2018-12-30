const mongoose = require('mongoose');


exports.loginForm = (req, res) => {
    const userEmail = req.body.email;
    console.log('login post')
    res.render('index', {  userEmail } )
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register'} )
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeData('name')
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'That email is not valid').isEmail();
    req.sanitize('email').normalizeEmail({
        remove_dots: true,
        remove_extention: false,
        gmail_remove_subaddress: false

    });
}
