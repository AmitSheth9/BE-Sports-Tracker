const { Router } = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDb = process.env.MDB
const { app } = require('../../app.js')
const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet.js')


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
            console.log('betform posted')
            res.send('bet posted');

        }catch (err) {
            next(err);
        }
    });
/*
    .get('/:username', async(req, res, next) => {
    
        console.log('hit route')
        let user = req.params.username;
        console.log(req.params.username);
       Bet.find({username: req.params.username})
       .then(users => res.json(users))
       .catch(err => res.status(400).json('Error: ' + err))
    });
*/
    
