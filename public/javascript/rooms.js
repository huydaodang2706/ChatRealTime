$(function() {
    var socket = io.connect('http://localhost:3000');
});

$(function() {
    var socket = io();
    var id = $('#user_id').val();
    var username = $('#user_name').val();
    var current_room_name;
    $('form#select_room').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        var room_name = $('#room').val();
        current_room_name = room_name;
        socket.emit('joinRoom', { id, username, room_name });
        $('#chat_room_area').css("display", "block");
        return false;
    });

    $('form#create_room').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        var room_name = $('#room_name').val();
        current_room_name = room_name;
        socket.emit('createRoom', { id, username, room_name });
        $('#chat_room_area').css("display", "block");
        return false;
    });

    socket.on('new_user_join', ({ id, username, room_name }) => {
        $('#messages').append($('<li>').text("User \"" + username + "\" has joined the chat"));
    });
    socket.on('new_room_created', ({ id, username, room_name }) => {
        console.log('Ok new room ...');
        $('#room').append($('<option>', {
            value: room_name,
            text: room_name
        }));
    });

    $('form#message_send').submit(function(e) {
        e.preventDefault();
        var message = $('#m').val();
        var id = $('#user_id').val();
        var username = $('#user_name').val();
        socket.emit('room_message', { id, username, message, current_room_name });
        $('#m').val('');
        return false;
    });

    socket.on('roomMessage', ({ id, username, message }) => {
        $('#messages').append($('<li>').text(username + " : " + message));
    });

    socket.on('user_leave_room', ({ id, username, room_name }) => {
        $('#messages').append($('<li>').text("User \"" + username + "\" has left room"));
    });
});