const { Router } = require('express');
const mongoose = require('mongoose');


module.exports = Router()
.post('/signup', async (req, res, next) => {
    console.log('signup test');
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err){

        }

        
    })
})
