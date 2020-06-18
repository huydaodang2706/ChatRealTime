const pool = require('./pool');

function Message() {};

Message.prototype = {
    get: function(callback) {
        var sql = `select username,body from users inner join messages on users.id = messages.user_id`;

        pool.query(sql, user, function(err, result) {
            if (err) throw err;
            callback(result);
        });
    }
}

module.exports = Message;