const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

//Models
const User = require('../model/User.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

//create user
router.post('/register', (req, res, next) => {
  const {username, password} = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    // Store hash in your password DB.
    const user = new User({
      username,
      password: hash
    });

    const promise = user.save();
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });

});
module.exports = router;
