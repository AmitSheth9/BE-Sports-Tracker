const { Router } = require('express')
const mongoose = require('mongoose');
const { response } = require('../../app');
const Schema = mongoose.Schema;
const mongoDb = process.env.MDB

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
/*
const Bet = mongoose.model(
    "Bet",
    new Schema({
      sport: { type: String, required: false },
      betType: { type: String, required: false },
      gamePart: { type: String, required: false },
      spread: { type: Number, required: false },
      overUnder: { type: String, required: false },
      total: { type: String, required: false },
      price: { type: Number, required: false },
      team: { type: String, required: false },
      win: { type: Number, required: false },
      wager: { type: Number, required: false },
      result: { type: String, required: false },
      betDate: { type: Date, required: false },
      notes: { type: String, required: false },
      submitDate: { type: Date, required: false },
      username: { type: String, required: false },
    })
  );

*/
module.exports = Router() 

.get('/:username', async(req, res, next) => {
    try{
        console.log('hit route')
        let user = req.params.username;
        console.log(req.params.username);
       let data = db.collection('bets').find({ username: user }, function(err, bets ) {
            if(err) {response.send(err);}
            console.log('bets', bets)
            response.json(bets);
        });
       res.send('data', data)
        
    } catch (err) {
        next(err)
    }
})