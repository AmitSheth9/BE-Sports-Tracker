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
       Bet.find({username: req.params.username})
       .then(users => res.json(users))
       .catch(err => res.status(400).json('Error: ' + err))
    });



   
    
