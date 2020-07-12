const express = require('express');
const User = require('../core/user');
const Message = require('../core/message');
const router = express.Router();
const session = require('express-session');
const { ReplSet } = require('mongodb');

const user = new User();
const message = new Message();
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
    message.get(function(result) {
        var user = req.session.currentUser;
        if (req.session.currentUser) {
            // message.get(function(result) {
            // console.log(result);
            // console.log(user);
            res.render('index', { oop: req.session.oop, username: user.username, user_id: user.user_id, chatMessages: result });
            return;
            // });

        }
        res.redirect('/');
    });

});

//Post login data
router.post('/login', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result) {
        if (result) {
            console.log(result.user);
            req.session.currentUser = {
                username: result.username,
                user_id: result.id
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

router.post('/message', (req, res, next) => {
    console.log('Dang o trong post message');

    var user = req.session.currentUser;
    console.log(user);

    var data = req.body;
    console.log(data);
    message.insert(user.user_id, data.body, function(message) {
        console.log('Success insert message to db');
    });
    return;

});

router.get('/test_message', (req, res, next) => {
    message.get(function(result) {
        console.log(result);
        res.send(result);
    });
});

router.get('/test_insert_message', (req, res, next) => {
    message.insert(8, 'Hello kitty', function(message) {
        console.log('This is insert action');
        console.log(message);
        res.send(message);
    });
});



module.exports = router;