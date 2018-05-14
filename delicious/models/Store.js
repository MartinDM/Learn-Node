const mongoose = require('mongoose');

// We'll use built-in ES6 promise, so tell Mongoose to use this Object of the Window as the promise.
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    // This is the model. Trim and prune the data here.
    name: {
        type: String,
        trim: true,
        required: 'Please enter store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String]
});

storeSchema.pre('save', function(next) {
    // Only run if store name is changed
    if( !this.isModified('name') ){
        next(); // skip the slug
        return; // stop the rest of this function running
    }
    /* before saving a store, auto generate the slug field.
       this is store name, call slug package on it to slugify it
    */
    this.slug = slug(this.name);
    next();
    // could be extended to check for unique names
});

module.exports = mongoose.model('Store', storeSchema)