const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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

exports.getStores = async (req, res) => {
  // Query db for list of stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores })
};

exports.editStore = async (req,res) => {
  
  // find the store from the id
  //res.json(req.params);
  const store = await Store.findOne( { _id: req.params.id });
  console.log(store)
  // confirm store owner
   
  // Render edit form so store can be edited
  res.render('editStore', { title: `Edit ${store.name}`, store } );

};