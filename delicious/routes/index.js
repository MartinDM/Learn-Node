const express = require('express');
const router = express.Router;
const storeController = require('../controllers/storeController');


/* Import homepage controller (it's an exported module)
  straight into get method.

   Render method no longer tied to the route.
   Wont need to be repeated as the function is separated out in a controller
*/
router.get('/', storeController.homePage);

module.exports = router;