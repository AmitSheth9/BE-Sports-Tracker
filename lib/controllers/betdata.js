const { Router } = require('express')
const mongoose = require('mongoose');
const { response } = require('../../app');
const Schema = mongoose.Schema;
const mongoDb = process.env.MDB
let Bet = require('../models/Bet.js')

module.exports = Router()
.get('/:username', async(req, res, next) => {
  console.log('hit route')
  let user = req.params.username;
  console.log(req.params.username);
  const bets = await Bet.find({username: req.params.username});
  
  const recentBets = await Bet.find({ $and: [ {username: req.params.username}, { submitDate:{$gte:  ("2022-01-24T23:59:59Z")}}]})
  console.log(recentBets);
  res.json([bets, recentBets]);
})
.delete('/:id', async(req, res, next) => {
  const { id }  = req.params;
  console.log(id);
  const bet = await Bet.remove({_id: id});
  res.json(bet);
});



   
    
