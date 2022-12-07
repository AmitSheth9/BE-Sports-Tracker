const express = require('express');
const cors = require('cors');
//var nodemailer = require('nodemailer');
//var crypto = require('crypto');
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authenticate = require('./lib/middleware/authenticate');
const path = require('path');
const IP = require('ip')

const ONE_DAY = 1000 * 60 * 60 * 24;
//test github
console.log('env', process.env.test);
const mongoDb = "mongodb+srv://bettrack:bettracker@cluster0.pe98c.mongodb.net/sportstracker?retryWrites=true&w=majority"
console.log(process.env.URI);
mongoose.connect(process.env.MDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      signupDate: { type: Date, required: true },
      resetPasswordToken: String,
      resetPasswordExpires: Date
    })
  );

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      credentials: true,
      origin: ['https://bettracker.netlify.app','http://localhost:3000'],
      exposedHeaders: ['set-cookie'],
    })
  );
app.options('*', cors({
    credentials: true,
    origin: ['https://bettracker.netlify.app','http://localhost:3000'],
    exposedHeaders: ['set-cookie'],
  }));
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
//app.use(cors());
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
                }
            });
            req.user = user;
        res.send('Signup succesful');
        }
    })
})

app.post('/login', 
passport.authenticate('local', { }), async (req, res) => {
    const user = req.user;
    const sessionToken = await jwt.sign({ username: req.body.username }, process.env.JWT_SECRET, { expiresIn: '1 day' });
    
    res.cookie('sessionbt', sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY,
    });
        console.log(req.cookies);
        res.send(sessionToken);
 });

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
    })
})

app.get('/logout', async (req, res) => {
    res.clearCookie('sessionbt');
    res.json({ success: true, message: 'Signed Out Succesfully' });
  });
  const API_URL = process.env.API_URL || 'http://localhost';
  const PORT = process.env.PORT || 7890;
  const ipAddress = IP.address();
  
  app.listen(PORT, () => {
    console.log(`🚀  Server started on ${API_URL}:${PORT}, ip address is ${ipAddress}`);
  });

module.exports = app;