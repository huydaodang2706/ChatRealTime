const express = require('express');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const session = require('express-session');

const io = require('socket.io')(server);


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: false }));

//server static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));

//template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//routes
app.use('/', pageRouter);

//session
app.use(session({
    secret: 'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

//errors
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
});

//handling errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
})


io.on('connection', (socket) => {
    console.log('a user connected!!!');
    socket.on('disconnect', () => {
        console.log('user disconnected!!!');
    });
    socket.on('chat message', (msg, id, username) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, id, username);
    });
});

//setting up the server
server.listen(3000, function() {
    console.log('listening on 3000');
});


module.exports = app;