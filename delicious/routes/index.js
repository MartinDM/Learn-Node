const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

/* Import homepage controller (it's an exported module)
  straight into get method.

   Render method no longer tied to the route.
   Wont need to be repeated as the function is separated out in a controller
*/
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);

// if landing on /add via a POST
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;