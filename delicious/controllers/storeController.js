const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOpts = {
  dest: 'uploads/',
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype == 'JPG'
    if (isPhoto) {
      // calling next with null. First is an error, second is the data to pass
      next(null, true) 
    } else {
      next( {message: 'That file type is not allowed'}, false )
    }
  }

};

exports.homePage = (req, res) => {
  console.log('test');
  req.flash('success', `You're on the homepage`)
  res.render('index');
};

exports.addStore = (req, res) => {
   res.render('editStore', { title: 'Add Store' });
};

// Async means there's no callbacks or using .then.
// async tells the 'await' function to wait for the save
exports.createStore = async (req, res) => {
  const store = await ( new Store(req.body) ).save();
  // Flash style, plus message
  req.flash('success', `Successfully Created ${store.name}. Leave a review?`);
  // only redirect once we have the store's slug form the awaited function above
  res.redirect(`/store/${store.slug}`);
};

// Test submission  - shows data in template
exports.testData = async (req,res) => { 
  const { name, description } = await req.body;
  res.render('test', { name, description, ...req.body } )
};

exports.getStores = async (req, res) => {
  // Query db for list of stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores })
};

exports.editStore = async (req,res) => {
  // Find the store from the id
  //res.json(req.params);
  const store = await Store.findOne( { _id: req.params.id });
  console.log(store)
  // Confirm store owner
   
  // Render edit form so store can be edited
  res.render('editStore', { title: `Edit ${store.name}`, store } );
};


exports.updateStore = async (req, res) => {
  // On save, set location type to be 'Point' again.
  req.body.location.type = 'Point';

  // find and update store. Await it.
  const store = await Store.findOneAndUpdate({
    _id: req.params.id }, // select the record
    req.body, // data to update it with
    // Options from Mongoose Model API
    { 
      new: true,
      runValidators: true, // ensure the update matches the model's schema
    }).exec(); // Run the query

  req.flash('success', `Successfully Edited ${store.name}.
        <a href="./stores/${store.slug}">View Store</a>`);
  // redirect to store with flash
  res.redirect(`/stores/${store._id}/edit`);

}