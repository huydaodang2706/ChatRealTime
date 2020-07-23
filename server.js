const express = require('express');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const session = require('express-session');

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');
const {
    newRoom,
    getCurrentRoom,
    getAllRoom
} = require('./utils/rooms');
const {
    loginUser,
    getUsers
} = require('./utils/login_users.js');
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
    socket.on('joinChatRoom', (id, new_username) => {
        const login_users = loginUser(id, new_username);
        socket.broadcast.emit('new_user_login', id, new_username);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected!!!');
    });
    // message in chat room (for all user)
    socket.on('chat message', (msg, id, username) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, id, username);
    });

    // join a room
    socket.on('joinRoom', ({ id, username, room_name }) => {
        socket.join(room_name);
        const user = userJoin(id, socket.id, username, room_name);
        // Broadcast when a user connects
        socket.broadcast.to(room_name).emit('new_user_join', { id, username, room_name });
        // When an user disconnect a room
        socket.on('disconnect', () => {
            const user_leave = userLeave(socket.id);
            socket.broadcast.to(user_leave.room).emit('user_leave_room', {
                id: user_leave.id,
                username: user_leave.username,
                room_name: user_leave.room
            });
        });
    });
    // create a room
    socket.on('createRoom', ({ id, username, room_name }) => {
        const room = newRoom(room_name);
        socket.join(room_name);
        console.log(`create room ${room_name} successfully`);
        const user = userJoin(id, socket.id, username, room_name);

        // Broadcast when a user connects
        io.emit('new_room_created', { id, username, room_name });
        // When an user disconnect a room
        socket.on('disconnect', () => {
            const user_leave = userLeave(socket.id);
            socket.broadcast.to(user_leave.room).emit('user_leave_room', {
                id: user_leave.id,
                username: user_leave.username,
                room_name: user_leave.room
            });
        });
    });
    socket.on('room_message', ({ id, username, message, current_room_name }) => {
        io.to(current_room_name).emit('roomMessage', { id, username, message });
    })
});

//setting up the server
server.listen(3000, function() {
    console.log('listening on 3000');
});


module.exports = app;