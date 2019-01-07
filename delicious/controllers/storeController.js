const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOpts = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){ 
    const isPhoto = file.mimetype.startsWith('image/')
    if (isPhoto) {
      // calling next with null. First is an error, second is the data to pass
      next(null, true) 
    } else {
      next( {message: 'That file type is not allowed'}, false )
    }
  }
};

exports.upload = multer(multerOpts).single('photo');

exports.resize = async(req, res, next) => {
  // check if no new file to resize
  if(!req.file) {
    next();
    return;
  } 
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
}


exports.homePage = (req, res) => {
  const welcomeMessage = req.session.logInSuccess ? `Welcome back` : `On Homepage`;
  req.flash('success', welcomeMessage )
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
  // Confirm store owner
   
  // Render edit form so store can be edited
  res.render('editStore', { title: `Edit ${store.name}`, store } );
};


exports.updateStore = async (req, res) => {
  
  // On save, set location type to be 'Point' again.
  req.body.location.type = 'Point';

  // find and update store. Await it.
  const store = await Store.findOneAndUpdate({
    _id: req.params.id
  }, // select the record
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

// Async as we're querying the db
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) return next();
  res.render('store', { title: store.name, store } );
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag; 
  const tagQuery = tag || { $exists: true }
  const storesPromise = Store.find({tags: tagQuery });
  const tagsPromise = Store.getTagsList();
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise])
  res.render('tags', { tags, title : 'Tags', tag, stores });
}