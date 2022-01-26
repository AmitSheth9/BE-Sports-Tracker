const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser')

const path = require('path');
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const res = require('express/lib/response');
const Schema = mongoose.Schema;

require('dotenv').config();

const mongoDb = process.env.MDB;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      signupDate: { type: Date, required: true }
    })
  );

const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
/*app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
*/
passport.use(
    new LocalStrategy((username, password, done) => {
        console.log('testlogin');
        console.log(username, password);
        User.findOne({ username: username },
            (err, user) => {
                if (err) {
                    return done(err);
                }
                if(!user) {
                    console.log('no user')
                    return done(null, false, {message: 'Incorrect username'});
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if(err) {
                        return done(err)
                    }
                    if(res) {
                        console.log('success', password, user.password )
                        return done(null, user);

                    }
                    console.log('fail', password, user.password)
                    return done(null, false, {message: 'Incorrect password'})
                });
            });
            
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use('/betform', require('./lib/controllers/betform'));
app.use('/betdata', require ('./lib/controllers/betdata'))

app.post('/signup', async(req, res, next) => {
    console.log('test signup')
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        console.log(req.body);
        if(err) {
            console.log(err);
            return next(err)
        }
        else{
            const user = new User({ 
                username: req.body.username,
                password: hashedPassword,
                signupDate: req.body.date
            }).save(err => {
                if(err) {
                    return next(err);
                    console.log('testerror', err)
                }
                
            });
        console.log('testuser', user);
        const response = 'signup success';
        console.log('responsesign', response)
                res.send(response);
        }
    } )
})

app.post('/login', 
   passport.authenticate('local', {
       
   }), (req, res) => {
    const response = 'login success';
    console.log('responselogin', response)
    res.send(response);
/*not able to either receive or print this message*/ }
    );

app.post('/change-password', async (req, res, next) => {
    console.log('changePW', req.body.username, req.body.password)
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        console.log(req.body);
        if(err) {
            console.log(err);
            return next(err)
        }
        else{
            console.log(hashedPassword)
          User.findOneAndUpdate({ username: req.body.username}, {$set: {password: hashedPassword}}, function (err, user){

            if (err) {
              return err;
            } 
           
            console.log('changepw after hash');
            res.send('password updated');
        });
        
        }
    } )
})

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => console.log("app listening on port 7890!"));



module.exports = app;