const express = require('express');
const router = express.Router();

/*Do work here
router.get('/', (req, res) => {
  const martin = {
    name: 'Martin', age: 30, cool: true
  }
  // res.send('test')
  //res.json(martin); 
  
  // req.query is an object with all query params. Built in to req. Can be passed to json.
  //res.send(req.query.name)
 /* res.send(`<p>${req.query.name} is ${req.query.age} years old</p>
  <p>${martin.name} is ${martin.age}</p>
  `)
  */

  // Using a   *.pug template from /views. Set up in app.js.
  // Extend layouts rather than pulling in, you grab layout and pass in the pieces using 'block [name]'

  // Pass in local vars to template ('locals')
  res.render('hello', { 
    name: 'martin',
    age: req.query.age,
    petName: req.query.dog
  });

// Another route

// NOTICE PLACEHOLDER VARIABLE IN URL

// Creating an endpoint to return something based on input
router.get('/reverse/:name', (req, res) => {
  // all data about the requet is in request variable

  // Reverse the string. Output it.
  const reverse = [...req.params.name].reverse().join(''); 

  //res.json(req.params.name); // uses the placeholder var above and elememts of the url
   res.json(req.query.name); // uses the queries attached to the url 

})

module.exports = router;