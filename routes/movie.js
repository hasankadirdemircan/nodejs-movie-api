const express = require('express');
const router = express.Router();

//model import
const Movie = require('../model/Movie');

// Get All Movie
router.get('/', (req, res) =>{
  const promise = Movie.find({ });
  promise.then((data)=>{

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


// imdb score'a gore top 10 listesi çekme
router.get('/top10', (req, res) =>{
  const promise = Movie.find({ }).limit(10).sort({imdb_score: -1});
  promise.then((data)=>{

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


// id'ye göre film çekme
router.get('/:movie_id', (req, res, next)=>{
  const promise = Movie.findById(req.params.movie_id);
  promise.then((data) => {
    if(!data)
      next({message: 'The movie was not found', code: 99});

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

// id'ye gore film güncelleme.
// new: true -> günccellenmiş datayı döndürmek için.
router.put('/:movie_id', (req, res, next)=>{
  const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, {new: true});

  promise.then((data) => {
    if(!data)
      next({message: 'The movie was not found', code: 99});

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


// id'ye göre film silme
router.delete('/:movie_id', (req, res, next)=>{
  const promise = Movie.findByIdAndDelete(req.params.movie_id);
  promise.then((data) => {
    if(!data)
      next({message: 'The movie was not found', code: 99});

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

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

// iki yıl arasındaki filmleri çekme
// gte -> büyük veya eşit anlamında
// lte -> küçük veya eşit anlamında
router.get('/between/:start_year/:end_year', (req, res) =>{
  const { start_year, end_year } = req.params;
  const promise = Movie.find({
    year: { "$gte": start_year, "$lte": end_year}
   });
  promise.then((data)=>{

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
