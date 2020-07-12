const pool = require('./pool');

function Message() {};

Message.prototype = {
    get: function(callback) {
        var sql = `select username,body from users inner join messages on users.id = messages.user_id`;

        pool.query(sql, function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    insert: function(user_id, message, callback) {
        var sql = `insert into messages(user_id,body) values (?,?)`;
        bind = [user_id, message];
        pool.query(sql, bind, function(err, result) {
            if (err) throw err;
            if (result.affectedRows != 1) {
                console.log('Error in create message');
                callback(null);
            } else
                callback(message);

        })
    }
}

module.exports = Message;