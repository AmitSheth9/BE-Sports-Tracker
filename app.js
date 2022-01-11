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

const mongoDb = process.env.mdb
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    })
  );

const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))

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
                password: hashedPassword
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




app.listen(7890, () => console.log("app listening on port 7890!"));



module.exports = app;