const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

/* Import homepage controller (it's an exported module)
  straight into get method.

   Render method no longer tied to the route.
   Wont need to be repeated as the function is separated out in a controller
*/

// Pass two using. Second one is the 'next' handler as defined in the router
router.get('/', storeController.myMiddleware, storeController.homePage);
router.get('/add', storeController.addStore);
router.get('/user', storeController.user);
router.get('/hello', storeController.hello);

// if landing on /add via a POST
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;