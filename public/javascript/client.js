// const Message = require('../../core/message');

// const message = new Message();

$(function() {
    var socket = io.connect('http://localhost:3000');
});

$(function() {
    var socket = io();
    var new_username = $('#user_name').val();
    socket.emit('joinChatRoom', new_username);
    socket.on('new_user_login', (new_username) => {
        $('#myDropdown').append(`<a href="#">${new_username}</a>`);
    });
    $('form#message_send').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        var message = $('#m').val();
        var id = $('#user_id').val();
        var username = $('#user_name').val();
        var data = {
            user_id: id,
            body: message
        }
        console.log(data);
        socket.emit('chat message', message, id, username);
        $('#m').val('');

        if (message != '') {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '/message',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(message) {
                    console.log('Success');
                },
                error: function(e) {
                        alert("Error!");
                        console.log("ERROR: ", e);
                    }
                    // processData: false,

            });
        } else
            return false;
    });
    socket.on('chat message', function(msg, id, username) {
        $('#messages').append($('<li>').text(username + " : " + msg));
    });
});