const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    //Find user data by id or username
    find: function(user = null, callback) {
        if (user) {
            var field = Number.isInteger(user) ? 'id' : 'username';
        };

        var sql = `select * from users where ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    create: function(body, callback) {
        let pwd = body.password;
        body.password = bcrypt.hashSync(pwd, 10);

        var bind = [body.username, body.password];

        let sql = `insert into users(username,password_digest) values (?,?)`;
        pool.query(sql, bind, function(err, result) {
            if (err) throw err;
            if (result.affectedRows != 1) {
                console.log('Error in create an acount');
                callback(null);
            } else
                callback(body.username);
        });
    },
    login: function(username, password, callback) {
        this.find(username, function(result) {
            if (result[0]) {
                // console.log(result[1].password);
                if (bcrypt.compareSync(password, result[0].password_digest)) {
                    // console.log(result[0]);
                    callback(result[0]);
                    return;
                }
            }
            callback(null);
        });
    }
}


module.exports = User;