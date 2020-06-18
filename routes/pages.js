const express = require('express');
const User = require('../core/user');
const Message = require('../core/message');
const router = express.Router();
const session = require('express-session');

const user = new User();

//session
router.use(session({
    secret: 'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

//get index page
router.get('/', function(req, res, next) {
    if (req.session.currentUser) {
        res.redirect('/chatroom');
        return;
    }
    res.render('login', { title: "My application" });
});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});
//Get home page
router.get('/chatroom', (req, res, next) => {
    let user = req.session.currentUser;
    if (req.session.currentUser) {
        res.render('index', { oop: req.session.oop, name: user.username });
        return;
    }
    res.redirect('/');
});

//Post login data
router.post('/login', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result) {
        if (result) {
            console.log(result.user);
            req.session.currentUser = {
                username: result.username
            }
            req.session.oop = 1;
            res.redirect('/chatroom');
            // res.render('show', { data: result, test: 'Brain Technology' });
        } else {
            // res.send('Username/Password incorrect');
            res.redirect('/');
        }
    })
});

//Post register data
router.post('/register', (req, res, next) => {
    let userInput = {
        username: req.body.username,
        password: req.body.password
    };

    user.create(userInput, function(lastId) {
        if (lastId) {
            // res.send('Welcome ' + userInput.username + ' password: ' + userInput.password);
            user.find(lastId, function(result) {
                req.session.currentUser = {
                    username: result.username
                };
                req.session.oop = 0;
                res.redirect('/chatroom');
            });
        } else {
            console.log('Error creating a new user .....');
            res.redirect('/');
        }
    })
});

//Get loggout page
router.get('/logout', (req, res, next) => {
    if (req.session.currentUser) {
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;