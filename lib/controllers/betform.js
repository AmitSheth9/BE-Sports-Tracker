const { Router } = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDb = process.env.mdb
console.log(process.env.mdb);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = mongoose.model(
    "Bet",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    })
  );
module.exports = Router() 
    .post('/betform', async(req, res, next) => {
        try{


        }catch (err) {
            next(err);
        }
    });

    