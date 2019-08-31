const express = require('express');
const router = express.Router();

//Model
const Director = require('../model/Director');

/*director ekleme. */
router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
