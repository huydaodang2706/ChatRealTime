const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://huydaodang2706:<password>@cluster0-t3zoq.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "huydaodang",
//     password: "haithanh1234",
//     database: "mydb"
// });
// // con.connect(function(err) {
// //     if (err) throw err;
// //     console.log("Connected!");
// //     var sql = "INSERT INTO customers (name, address) VALUES ?";
// //     var values = [
// //         ['John', 'Highway 71'],
// //         ['Peter', 'Lowstreet 4'],
// //         ['Amy', 'Apple st 652'],
// //         ['Hannah', 'Mountain 21'],
// //         ['Michael', 'Valley 345'],
// //         ['Sandy', 'Ocean blvd 2'],
// //         ['Betty', 'Green Grass 1'],
// //         ['Richard', 'Sky st 331'],
// //         ['Susan', 'One way 98'],
// //         ['Vicky', 'Yellow Garden 2'],
// //         ['Ben', 'Park Lane 38'],
// //         ['William', 'Central st 954'],
// //         ['Chuck', 'Main Road 989'],
// //         ['Viola', 'Sideway 1633']
// //     ];
// //     con.query(sql, [values], function(err, result) {
// //         if (err) throw err;
// //         console.log("Number of records inserted: " + result.affectedRows);
// //     });
// // });

// // con.connect(function(err) {
// //     if (err) throw err;
// //     con.query("SELECT * FROM customers", function(err, result, fields) {
// //         if (err) throw err;
// //         console.log(result);
// //     });
// // });



// app.post('/quotes', (req, res) => {
//     console.log('Hello this is a form');
//     console.log(req.body);
// });