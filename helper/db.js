const mongoose = require('mongoose');

module.exports = () => {

    //mongoose connection ayarini yapiyoruz.
    mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true });

    mongoose.connection.on('open', ()=>{
    console.log('mongodb connection succesfull');
    });

    mongoose.connection.on('error', (err)=>{
    console.log('mongodb connection failed.', err);
    });
};
