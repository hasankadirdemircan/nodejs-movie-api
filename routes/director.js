const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Model
const Director = require('../model/Director');

/*director ekleme. */
router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//tüm director ve filmlerini listeler.
router.get('/', (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',//join edilecek tablo collection
        localField: '_id', //director tablosundkai eşlenecek field.
        foreignField: 'director_id', //movies collections'da hangi field ile eşleşecek.
        as: 'movies' //dönen datanın atacağı değişken object.
      }
    },
    {
      $unwind: {
        path: '$movies', //lookup'da dönen datayı alıyoruz.
        preserveNullAndEmptyArrays: true //filmi olmayan directorlerde gelsin.
      }
    },
    {//director objesi icerisinde filmler gösterilmesi icin.
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// director_id verilen ve filmlerini listeler.
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([
    {//sadece gelen id'ye göre çek
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies',//join edilecek tablo collection
        localField: '_id', //director tablosundkai eşlenecek field.
        foreignField: 'director_id', //movies collections'da hangi field ile eşleşecek.
        as: 'movies' //dönen datanın atacağı değişken object.
      }
    },
    {
      $unwind: {
        path: '$movies', //lookup'da dönen datayı alıyoruz.
        preserveNullAndEmptyArrays: true //filmi olmayan directorlerde gelsin.
      }
    },
    {//director objesi icerisinde filmler gösterilmesi icin.
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// id'ye gore director güncelleme.
// new: true -> güncellenmiş datayı döndürmek için.
router.put('/:director_id', (req, res, next)=>{
  const promise = Director.findByIdAndUpdate(req.params.director_id, req.body, {new: true});

  promise.then((data) => {
    if(!data)
      next({message: 'The director was not found', code: 99});

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

// id'ye göre director silme
router.delete('/:director_id', (req, res, next)=>{
  const promise = Director.findByIdAndDelete(req.params.director_id);
  promise.then((data) => {
    if(!data)
      next({message: 'The director was not found', code: 99});

    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
