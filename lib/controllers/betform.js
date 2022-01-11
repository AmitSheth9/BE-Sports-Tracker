const { Router } = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDb = process.env.mdb
console.log(process.env.mdb);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

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
module.exports = Router() 
    .post('/', async(req, res, next) => {
        try{
            const bet = new Bet({ 
                sport: req.body.sport,
                betType: req.body.betType,
                gamePart: req.body.gamePart,
                spread: req.body.spread,
                overUnder: req.body.overUnder,
                total: req.body.total,
                price: req.body.price,
                team: req.body.team,
                win: req.body.win,
                wager: req.body.wager,
                result: req.body.result,
                betDate: req.body.betDate,
                notes: req.body.notes,
                submitDate: req.body.submitDate,
                username: req.body.username,

            }).save(err => {
                if(err) {
                    return next(err);
                    console.log('testerror', err)
                }
                
            });
            res.send('bet posted');

        }catch (err) {
            next(err);
        }
    });

    