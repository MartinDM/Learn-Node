const mongoose = require('mongoose');
const Store = mongoose.model('Store');
// Anything on exports is import-able into another file
// Middleware runs before routes.

// Example controller
exports.myMiddleware = (req, res, next) => {
    req.name = 'martin';
    req.thing = 'yo';
    // Move on to next function at te point of user.
    // Run code after request, but before response.

    if ( req.name === 'martin' ) {
         throw new Error('that is stupid');
    }
    // Passes on to next function in router.get (below)
    next();
}

exports.homePage = (req, res) => {
    res.cookie('name', 'martin', { maxAge: 90000 });

    req.flash('info', 'Info here!');
    req.flash('warning', 'warning here!');
    req.flash('error', 'Error here!');
    req.flash('error', 'Error 2 here!');
    req.flash('success', 'Success here!');
    res.render('index');
}

exports.addStore = (req, res) => { 
    res.render('editStore', { title: 'Add Store' }); 
    console.log(res)
    //console.table(req)
}

// nominate a error-handling function


// functions can be specified as async, then marked as 'await' to pause execution

// req.body is the posted data from the form
exports.createStore = async (req, res) => {
    /* outputs json:
         console.log(req.body)
         res.json(req.body) */
    // Object has all our schema props in it. 
    const store = new Store(req.body);
    
    await store.save();
    // returns a Promise 
    console.log('saved!');

    req.flash('success', 'Added ${store.name}. Add another?');
    res.redirect('/');

    // then(store => {
    //     return Store.find();
    // })
    // .then(stores => {
    //     return Promise;
    // })
    // .catch(err => {
    //     throw Error;
    // }) 
     
    /* JS is asynchronous by default
         save can take time, but code will keep executing.
        Confirmation needs to know if it saved or not!
    */
}

// Using COMPOSITION
// Wrapping a function inside a function inside an error handler
 