var password = '';

fs = require('fs')
fs.readFile('./password', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  password = String(data);
  console.log("pass again: " + password);
});


var mysql      = require('mysql');
console.log("pass again again: " + password);
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : password,
  database : 'strife_db'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
