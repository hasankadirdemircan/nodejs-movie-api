const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/authenticate', (req, res) => {
  const {username, password} = req.body;
  User.findOne({
    username
  }, (err, data) =>{
    if(err)
      throw err;
    if(!data){
      //user yok. hata fırlat.
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{
      //user var şifreleri karşılaştır.
      bcrypt.compare(password, data.password).then((result) => {
        if(!result){
          res.json({
            status: false,
            message: 'Authentication failed, password not valid.'
          });
        }else{
          const payload = {
            username
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 720 //12 saat
          });
          res.json({
            status: true,
            token
          });
        }
      });
    }
  });
});

module.exports = router;
