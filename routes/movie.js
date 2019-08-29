const express = require('express');
const router = express.Router();

//model import
const Movie = require('../model/Movie');

router.post('/', (req, res, next) => {
    // 1. yol.
    //const {title, category, country, year, director, imdb_score}  = req.body; //title atamalari. //destry acting
  /*
  1. yol.

    const movie = new Movie({
      title: title,
      category: category,
      country: country,
      year: year,
      director: director,
      imdb_score: imdb_score
    });
  */

  // 2. yol
  const movie = new Movie(req.body);
  /*
    movie.save((err, data)=>{
      //data db ye eklendiginde eklenen data.
      if(err)
        res.json(err);

      res.json(data);
    })
  });
  */
  //yukaridaki movie.save methodu yerine promise yapisini kullanabiliriz.
  const promise = movie.save();
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});

module.exports = router;
